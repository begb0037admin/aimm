"""Shared client for sending complete video chunk sets to the AIMM Worker."""

import json
import os
import time
import urllib.error
import urllib.request


def _config():
    """Read runtime configuration without ever embedding credentials in code."""
    proxy_url = os.environ.get("AIMM_PROXY_URL", "").strip().rstrip("/")
    ingest_key = os.environ.get("AIMM_INGEST_KEY", "")
    if not ingest_key:
        raise RuntimeError("Set AIMM_INGEST_KEY in the environment before using KB embeddings")
    if not proxy_url:
        raise RuntimeError("Set AIMM_PROXY_URL in the environment before using KB embeddings")
    return proxy_url, ingest_key


def group_chunks_by_video(chunk_index_entries):
    """Group flat kb-search-index entries by video_id in chunk order.

    Deliberately does NOT call _config() — this is pure local grouping with no
    Worker call, so --dry-run (and any other inspection use) must work without
    AIMM_PROXY_URL/AIMM_INGEST_KEY set. Only upsert_video_chunks(), which
    actually calls the Worker, requires that env config.
    """
    grouped = {}
    for entry in chunk_index_entries:
        if not isinstance(entry, dict):
            raise ValueError("KB search index entries must be objects")
        video_id = entry.get("video_id")
        if not isinstance(video_id, str) or not video_id.strip():
            raise ValueError("KB search index entry is missing video_id")
        text = entry.get("x")
        if not isinstance(text, str) or not text:
            raise ValueError(f"KB search index entry {video_id} is missing x text")
        grouped.setdefault(video_id, []).append({
            "chunk": entry.get("chunk"),
            "text": text,
            "title": entry.get("title", ""),
            "channel": entry.get("channel", ""),
        })
    return grouped


def _response_error(response):
    try:
        detail = response.read().decode("utf-8", errors="replace")
    except Exception:
        detail = ""
    return detail[:500]


def upsert_video_chunks(video_id, chunks, timeout=60):
    """POST one video's complete current chunk set to the Worker.

    Network failures and HTTP 502 are retried up to three times after the
    initial attempt with exponential backoff. A bad ingest key (HTTP 403) is
    surfaced immediately.
    """
    proxy_url, ingest_key = _config()
    if not isinstance(video_id, str) or not video_id.strip():
        raise ValueError("video_id is required")
    if not isinstance(chunks, list) or not chunks:
        raise ValueError("chunks must be a non-empty list")

    payload = json.dumps({"video_id": video_id, "chunks": chunks}).encode("utf-8")
    request = urllib.request.Request(
        f"{proxy_url}/kb/upsert",
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-AIMM-Ingest-Key": ingest_key,
        },
    )

    last_error = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                raw = response.read().decode("utf-8", errors="replace")
                status = response.status
            if status == 403:
                raise RuntimeError("AIMM Worker rejected X-AIMM-Ingest-Key (HTTP 403)")
            if status == 502:
                last_error = RuntimeError(f"AIMM Worker HTTP 502: {raw[:500]}")
                if attempt < 3:
                    time.sleep(2 ** attempt)
                    continue
                raise last_error
            if status < 200 or status >= 300:
                raise RuntimeError(f"AIMM Worker HTTP {status}: {raw[:500]}")
            try:
                result = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise RuntimeError(f"AIMM Worker returned malformed JSON: {exc}") from exc
            if (not isinstance(result, dict) or result.get("ok") is not True or
                    result.get("video_id") != video_id or
                    result.get("chunks_upserted") != len(chunks)):
                raise RuntimeError(f"AIMM Worker returned malformed response: {raw[:500]}")
            return result
        except urllib.error.HTTPError as exc:
            detail = _response_error(exc)
            if exc.code == 403:
                raise RuntimeError("AIMM Worker rejected X-AIMM-Ingest-Key (HTTP 403)") from exc
            if exc.code != 502:
                raise RuntimeError(f"AIMM Worker HTTP {exc.code}: {detail}") from exc
            last_error = RuntimeError(f"AIMM Worker HTTP 502: {detail}")
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = RuntimeError(f"AIMM Worker network error: {exc}")
        except RuntimeError:
            raise

        if attempt < 3:
            time.sleep(2 ** attempt)

    raise last_error or RuntimeError("AIMM Worker upsert failed")
