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


def collection_keys(node, definitions, seen=None):
    """Return literal registration keys from a static table expression."""
    seen = set() if seen is None else seen
    if isinstance(node, ast.Name):
        if node.id in seen or node.id not in definitions:
            return None
        return collection_keys(definitions[node.id], definitions, seen | {node.id})
    if isinstance(node, ast.Dict):
        out = []
        for key, value in zip(node.keys, node.values):
            if key is None:
                nested = collection_keys(value, definitions, seen)
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
            if isinstance(item, (ast.Tuple, ast.List)) and item.elts:
                key = literal(item.elts[0])
            else:
                key = literal(item)
            if not isinstance(key, str):
                return None
            out.append(key)
        return out
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Attribute) and node.func.attr == "items":
            return collection_keys(node.func.value, definitions, seen)
        if isinstance(node.func, ast.Name) and node.func.id == "set" and len(node.args) == 1:
            return collection_keys(node.args[0], definitions, seen)
    if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.BitOr)):
        left = collection_keys(node.left, definitions, seen)
        right = collection_keys(node.right, definitions, seen)
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
                                rows.append((literal(nested_key), callee(nested_value), node.lineno))
                    elif isinstance(literal(key), str):
                        rows.append((literal(key), callee(value), node.lineno))
            if not (isinstance(target, ast.Subscript) and isinstance(target.value, ast.Name)
                    and target.value.id == "ALL_CHECKERS"):
                continue
            key = literal(target.slice)
            if isinstance(key, str):
                rows.append((key, callee(node.value), node.lineno))
                continue
            cur = node
            while cur in parent and not isinstance(parent[cur], (ast.For, ast.AsyncFor)):
                cur = parent[cur]
            loop = parent.get(cur)
            keys = collection_keys(loop.iter, definitions) if loop else None
            if keys is None:
                unresolved.append((node.lineno, ast.unparse(loop.iter)[:100] if loop else "no loop"))
            else:
                rows.extend((k, callee(node.value), node.lineno) for k in keys)
    return rows, unresolved


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: pluginhub_registry_audit.py vendor_checkers.py")
    source = Path(sys.argv[1])
    tree = ast.parse(source.read_text(encoding="utf-8"), filename=str(source))
    rows, unresolved = registrations(tree, assignments(tree))
    # Source line gives the order in which top-level registrations are defined.
    # Conditional registration and runtime import availability remain unknown.
    final = {}
    for key, binding, line in sorted(rows, key=lambda row: row[2]):
        final[key] = (binding, line)
    writer = csv.writer(sys.stdout)
    writer.writerow(("registry_key", "last_static_binding", "source_line"))
    for key in sorted(final):
        writer.writerow((key, *final[key]))
    print(f"# static_keys={len(final)} registrations={len(rows)} unresolved_sites={len(unresolved)}", file=sys.stderr)
    for line, expression in unresolved:
        print(f"# unresolved line {line}: {expression}", file=sys.stderr)


if __name__ == "__main__":
    main()
