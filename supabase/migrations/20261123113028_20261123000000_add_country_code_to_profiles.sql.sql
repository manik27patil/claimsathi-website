/*
# Add country_code column to profiles

1. Changes
- New column `country_code` (text, nullable) — the dialing prefix (e.g. +91, +1, +44)
  collected during profile completion alongside mobile_number and country.

2. Security
- No RLS policy changes. Existing owner-scoped SELECT/INSERT/UPDATE policies remain intact.
- The UPDATE policy already allows users to update their own row.

3. Notes
- No data is lost. Existing rows keep their values; the new column defaults to NULL.
- This column stores the international dialing code, separate from the country of residence.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_code text;