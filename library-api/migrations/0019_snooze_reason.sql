-- Persist the reason a user snoozed a product update so account surfaces can
-- show the decision and its expiry together. Existing marks remain unchanged.
ALTER TABLE library_marks
  ADD COLUMN snooze_reason TEXT CHECK (snooze_reason IS NULL OR length(snooze_reason) <= 240);
