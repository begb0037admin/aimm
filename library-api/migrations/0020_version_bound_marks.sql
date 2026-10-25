-- A mark suppresses a repeated update prompt only for the exact latest
-- version observed by the account. A newer version makes the mark expire.
ALTER TABLE library_marks
  ADD COLUMN marked_latest_version TEXT CHECK (
    marked_latest_version IS NULL OR length(marked_latest_version) BETWEEN 1 AND 100
  );

ALTER TABLE library_marks
  ADD COLUMN marked_at TEXT;
