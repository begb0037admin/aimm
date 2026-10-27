#!/usr/bin/env python3
"""Create transcript-grounded question-generation prompts for human/LLM review."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cards", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--questions-per-video", type=int, default=12)
    args = parser.parse_args()
    if not 1 <= args.questions_per_video <= 40:
        parser.error("--questions-per-video must be between 1 and 40")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with args.cards.open(encoding="utf-8") as source, args.output.open("w", encoding="utf-8") as target:
        for line in source:
            if not line.strip():
                continue
            card = json.loads(line)
            excerpts = card.get("evidence", [])
            prompt = {
                "task": "Write realistic search questions that this specific video answers. Use only the supplied transcript evidence; do not invent facts.",
                "video_id": card["video_id"],
                "title": card["title"],
                "channel": card["channel"],
                "target_count": args.questions_per_video,
                "question_mix": [
                    "direct factual questions",
                    "colloquial spoken questions with filler words",
                    "paraphrases that avoid the title's wording",
                    "questions phrased as a problem or desired outcome",
                    "questions using an alternate term that the transcript supports",
                ],
                "transcript_evidence": excerpts,
                "constraints": [
                    "Every question must have a clear answer in this video's supplied evidence.",
                    "Use varied intent and wording; reject near-duplicate questions.",
                    "Do not use the video title verbatim as the question.",
                    "Return JSON only, with a questions array.",
                    "Each item must contain question, evidence_chunk, and exact_evidence_quote copied from the supplied transcript.",
                ],
                "output_schema": {
                    "questions": [{
                        "question": "...",
                        "evidence_chunk": "...",
                        "exact_evidence_quote": "...",
                    }],
                },
            }
            target.write(json.dumps(prompt, ensure_ascii=False) + "\n")
            count += 1
    print(f"Wrote {count} per-video generation jobs ({count * args.questions_per_video} requested questions) to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
