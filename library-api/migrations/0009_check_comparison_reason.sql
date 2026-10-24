-- Preserve why a vendor result was classified, without fabricating a version.
ALTER TABLE check_observations ADD COLUMN comparison_reason TEXT
  CHECK (comparison_reason IS NULL OR comparison_reason IN (
    'vendor_update_signal',
    'vendor_current_signal',
    'numeric_version_newer',
    'numeric_version_current',
    'version_missing',
    'version_unparseable',
    'manual_check_required'
  ));
