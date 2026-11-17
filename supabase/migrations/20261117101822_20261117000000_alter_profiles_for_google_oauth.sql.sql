/*
# Alter profiles table for Google OAuth support

1. Changes
- `mobile_number`: changed from NOT NULL to nullable — Google Sign-In does not provide a phone number;
  the user completes it on the profile-completion page after first login.
- `full_name`: kept NOT NULL — Google always provides a name (falls back to email prefix if missing).
- `email`: kept NOT NULL — Google always provides a verified email.
- New column `country` (text, nullable) — collected during profile completion.

2. Security
- No RLS policy changes. Existing owner-scoped SELECT/INSERT/UPDATE policies remain intact.
- The UPDATE policy already allows users to update their own row, which is needed to save
  mobile_number and country during profile completion.

3. Notes
- No data is lost. Existing rows keep their values; the new column defaults to NULL.
- Google OAuth users get a profile row created automatically on first sign-in (via the frontend
  after OAuth redirect). Returning users are matched by their auth.users ID, preserving all
  existing claim history.
*/

ALTER TABLE profiles ALTER COLUMN mobile_number DROP NOT NULL;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country text;
