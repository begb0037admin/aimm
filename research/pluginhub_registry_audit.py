#!/usr/bin/env python3
"""Inventory PluginHub checker registrations without importing or executing it.

Usage: python3 research/pluginhub_registry_audit.py /path/to/vendor_checkers.py
This is a source audit for Phase One, not AIMM runtime code.
"""

import ast
import csv
import sys
from pathlib import Path


def literal(node):
    if isinstance(node, ast.Constant):
        return node.value
    return None


def callee(node):
    if isinstance(node, ast.Call):
        return callee(node.func)
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return f"{callee(node.value)}.{node.attr}"
    return ast.unparse(node)[:80]


def collection_keys(node, definitions, seen=None, key_index=0):
    """Return literal registration keys from a static table expression."""
    seen = set() if seen is None else seen
    if isinstance(node, ast.Name):
        if node.id in seen or node.id not in definitions:
            return None
        return collection_keys(definitions[node.id], definitions, seen | {node.id}, key_index)
    if isinstance(node, ast.Dict):
        out = []
        for key, value in zip(node.keys, node.values):
            if key is None:
                nested = collection_keys(value, definitions, seen, key_index)
                if nested is None:
                    return None
                out.extend(nested)
            elif isinstance(key, ast.Constant) and isinstance(key.value, str):
                out.append(key.value)
            else:
                return None
        return out
    if isinstance(node, (ast.List, ast.Tuple, ast.Set)):
        out = []
        for item in node.elts:
            if isinstance(item, (ast.Tuple, ast.List)) and len(item.elts) > key_index:
                key = literal(item.elts[key_index])
            else:
                key = literal(item)
            if not isinstance(key, str):
                return None
            out.append(key)
        return out
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Attribute) and node.func.attr == "items":
            return collection_keys(node.func.value, definitions, seen, key_index)
        if isinstance(node.func, ast.Name) and node.func.id == "set" and len(node.args) == 1:
            return collection_keys(node.args[0], definitions, seen, key_index)
    if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.BitOr)):
        left = collection_keys(node.left, definitions, seen, key_index)
        right = collection_keys(node.right, definitions, seen, key_index)
        return left + right if left is not None and right is not None else None
    return None


def assignments(tree):
    definitions = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    definitions[target.id] = node.value
    return definitions


def registrations(tree, definitions):
    parent = {child: node for node in ast.walk(tree) for child in ast.iter_child_nodes(node)}
    rows = []
    unresolved = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Assign):
            continue
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id == "ALL_CHECKERS" and isinstance(node.value, ast.Dict):
                for key, value in zip(node.value.keys, node.value.values):
                    if key is None and isinstance(value, ast.Dict):
                        for nested_key, nested_value in zip(value.keys, value.values):
                            if isinstance(literal(nested_key), str):
                                rows.append((literal(nested_key), callee(nested_value), node.lineno, False))
                    elif isinstance(literal(key), str):
                        rows.append((literal(key), callee(value), node.lineno, False))
            if not (isinstance(target, ast.Subscript) and isinstance(target.value, ast.Name)
                    and target.value.id == "ALL_CHECKERS"):
                continue
            key = literal(target.slice)
            cur = node
            while cur in parent and not isinstance(parent[cur], (ast.For, ast.AsyncFor)):
                cur = parent[cur]
            loop = parent.get(cur)
            # A guard of `key not in ALL_CHECKERS` is a fallback, not an override.
            ancestors = []
            cur = node
            while cur in parent:
                cur = parent[cur]
                ancestors.append(cur)
            guarded = any(isinstance(a, ast.If) and isinstance(a.test, ast.Compare)
                          and any(isinstance(op, ast.NotIn) for op in a.test.ops)
                          and any(isinstance(c, ast.Name) and c.id == 'ALL_CHECKERS'
                                  for c in a.test.comparators) for a in ancestors)
            # This helper wraps existing entries after an existence check. It is
            # not an independent checker registration or a new coverage claim.
            if any(isinstance(a, ast.FunctionDef) and a.name == '_install_result_augmentation'
                   for a in ancestors):
                continue
            if isinstance(key, str):
                rows.append((key, callee(node.value), node.lineno, guarded))
                continue
            key_index = 0
            if loop and isinstance(target.slice, ast.Name) and isinstance(loop.target, (ast.Tuple, ast.List)):
                names = [e.id if isinstance(e, ast.Name) else None for e in loop.target.elts]
                if target.slice.id in names:
                    key_index = names.index(target.slice.id)
            keys = collection_keys(loop.iter, definitions, key_index=key_index) if loop else None
            if keys is None:
                unresolved.append((node.lineno, ast.unparse(loop.iter)[:100] if loop else "no loop"))
            else:
                rows.extend((k, callee(node.value), node.lineno, guarded) for k in keys)
    return rows, unresolved


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: pluginhub_registry_audit.py vendor_checkers.py")
    source = Path(sys.argv[1])
    tree = ast.parse(source.read_text(encoding="utf-8"), filename=str(source))
    rows, unresolved = registrations(tree, assignments(tree))
    # Source line orders registration statements. Guarded fallbacks do not
    # overwrite an earlier key; other runtime guards/imports remain unknown.
    final = {}
    for key, binding, line, guarded in sorted(rows, key=lambda row: row[2]):
        if guarded and key in final:
            continue
        final[key] = (binding, line)
    writer = csv.writer(sys.stdout)
    writer.writerow(("registry_key", "last_static_expression", "source_line"))
    for key in sorted(final):
        writer.writerow((key, *final[key]))
    print(f"# static_keys={len(final)} registrations={len(rows)} unresolved_sites={len(unresolved)}", file=sys.stderr)
    for line, expression in unresolved:
        print(f"# unresolved line {line}: {expression}", file=sys.stderr)


if __name__ == "__main__":
    main()
