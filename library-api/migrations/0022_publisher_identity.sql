-- Add explicit, bounded publisher provenance and a nullable reviewed product identity.
-- Existing rows remain unresolved; no publisher or cross-format identity is inferred.
ALTER TABLE published_inventory_records
  ADD COLUMN publisher_name TEXT
  CHECK (publisher_name IS NULL OR (length(publisher_name) BETWEEN 1 AND 120 AND publisher_name = trim(publisher_name)));

ALTER TABLE published_inventory_records
  ADD COLUMN publisher_source TEXT
  CHECK (publisher_source IS NULL OR publisher_source IN (
    'infoPlistManufacturer',
    'infoPlistVendor'
  ));

ALTER TABLE published_inventory_records
  ADD COLUMN canonical_product_id TEXT
  CHECK (canonical_product_id IS NULL OR (length(canonical_product_id) BETWEEN 1 AND 255 AND canonical_product_id = trim(canonical_product_id)));
