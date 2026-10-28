#!/usr/bin/env python3
"""Generate a small, transcript-grounded query candidate set with local MLX."""

from __future__ import annotations

import argparse
import json
import random
import re
import sys
from pathlib import Path


DEFAULT_MODEL = "mlx-community/Qwen3-4B-4bit"


def read_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, 1):
            if line.strip():
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError as exc:
                    raise ValueError(f"{path}:{number}: {exc}") from exc
    return rows


def normalize(text: str) -> str:
    return " ".join(text.casefold().split())


def parse_output(text: str) -> dict:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned, flags=re.IGNORECASE)
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("model output did not contain a JSON object")
    payload = json.loads(cleaned[start:end + 1])
    if not isinstance(payload, dict):
        raise ValueError("model output must be a JSON object")
    return payload


def make_prompt(card: dict) -> str:
    excerpts = [
        {"chunk": item.get("chunk"), "text": str(item.get("text") or "")[:1400]}
        for item in card.get("evidence", [])[:3]
    ]
    return (
        "Create exactly one natural search question a music producer might ask. "
        "It must be directly answerable using one supplied transcript excerpt alone. "
        "Ask about one fact or action from the transcript; do not combine topics, "
        "infer a benefit, or add a technique, instrument, effect, or outcome that "
        "the excerpt does not explicitly state. Prefer the transcript's own key "
        "technical words over synonyms. Do not use a title. Include a short answer "
        "and copy the exact sentence fragment that supports both the question and "
        "answer, with its chunk number. Return only JSON matching this schema: "
        '{"question":"...","answer":"...","evidence_chunk":0,"exact_evidence_quote":"..."}.\n\n'
        f"Transcript excerpts: {json.dumps(excerpts, ensure_ascii=False)}"
    )


def has_long_title_copy(question: str, title: str) -> bool:
    q = normalize(question)
    title_tokens = re.findall(r"[a-z0-9]+", normalize(title))
    for size in (5, 4):
        for start in range(max(0, len(title_tokens) - size + 1)):
            phrase = " ".join(title_tokens[start:start + size])
            if phrase and phrase in q:
                return True
    return False


def generate_one(model, tokenizer, card: dict, seen: set[str]) -> dict:
    last_error = "invalid model output"
    for attempt in range(3):
        instruction = make_prompt(card)
        if attempt:
            instruction += (
                f"\nPrevious output was invalid ({last_error}). Return a different question, "
                "use an exact quote from the excerpt, and follow the JSON schema exactly."
            )
        try:
            messages = [{"role": "user", "content": instruction}]
            prompt = tokenizer.apply_chat_template(
                messages, tokenize=False, add_generation_prompt=True, enable_thinking=False
            )
            from mlx_lm import generate
            from mlx_lm.sample_utils import make_sampler
            raw = generate(
                model, tokenizer, prompt=prompt, max_tokens=220,
                sampler=make_sampler(temp=0.4, top_p=0.9), verbose=False,
            )
            payload = parse_output(raw)
            question = str(payload.get("question") or "").strip()
            quote = " ".join(str(payload.get("exact_evidence_quote") or "").split())
            chunk = str(payload.get("evidence_chunk"))
            evidence = [item for item in card.get("evidence", []) if str(item.get("chunk")) == chunk]
            supported = any(
                normalize(quote) and normalize(quote) in normalize(str(item.get("text") or ""))
                for item in evidence
            )
            key = normalize(question)
            if (
                question.endswith("?") and 12 <= len(question) <= 220 and supported and
                key not in seen and not has_long_title_copy(question, str(card.get("title") or ""))
            ):
                seen.add(key)
                return {
                    "query": question,
                    "draft_answer": str(payload.get("answer") or "").strip(),
                    "positive_video_ids": [str(card["video_id"])],
                    "judged_negative_video_ids": [],
                    "evidence": [{"video_id": str(card["video_id"]), "chunk": chunk, "quote": quote}],
                    "source": "mlx_qwen3_4b_transcript_synthetic",
                    "verified": False,
                    "split": "",
                    "group_id": str(card["video_id"]),
                }
            last_error = "quote, question shape, title-overlap, or uniqueness check failed"
        except (ValueError, json.JSONDecodeError) as exc:
            last_error = str(exc)
    raise ValueError(f"could not generate a valid query for {card.get('video_id')}: {last_error}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, required=True)
    parser.add_argument("--benchmark", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--exclude-candidates", type=Path)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--train-queries", type=int, default=100)
    parser.add_argument("--validation-queries", type=int, default=20)
    parser.add_argument("--seed", type=int, default=20261028)
    args = parser.parse_args()
    try:
        from mlx_lm import load
        cards = read_jsonl(args.cards)
        payload = json.loads(args.benchmark.read_text(encoding="utf-8"))
        benchmark = payload.get("results") if isinstance(payload, dict) else payload
        excluded = {str(video_id) for row in benchmark for video_id in row.get("expected", [])}
        seen: set[str] = set()
        if args.exclude_candidates:
            prior = read_jsonl(args.exclude_candidates)
            excluded.update(str(video_id) for row in prior for video_id in row.get("positive_video_ids", []))
            seen.update(" ".join(str(row.get("query") or "").casefold().split()) for row in prior)
        available = [card for card in cards if str(card.get("video_id")) not in excluded]
        needed = args.train_queries + args.validation_queries
        if needed < 1 or len(available) < needed:
            raise ValueError(f"need {needed} eligible videos; only {len(available)} remain after benchmark holdout")
        random.Random(args.seed).shuffle(available)
        selected = available
        print(f"Loading local model {args.model}; no API credentials are used.", flush=True)
        model, tokenizer = load(args.model)
        output = []
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open("w", encoding="utf-8") as handle:
            for card in selected:
                if len(output) >= needed:
                    break
                try:
                    row = generate_one(model, tokenizer, card, seen)
                except ValueError as exc:
                    print(f"Skipped {card.get('video_id')}: {exc}", flush=True)
                    continue
                row["split"] = "train" if len(output) < args.train_queries else "validation"
                output.append(row)
                handle.write(json.dumps(row, ensure_ascii=False) + "\n")
                handle.flush()
                print(f"[{len(output)}/{needed}] {row['split']} candidate accepted (evidence quote matched).", flush=True)
        if len(output) != needed:
            raise ValueError(f"generated {len(output)} of {needed} requested candidates")
        print(f"Saved {len(output)} unverified candidates to {args.output}")
        print("Candidates remain unverified; reviewed hard negatives and semantic review are still required before training.")
    except ImportError as exc:
        print(f"ERROR: missing local generation dependency: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"ERROR: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
