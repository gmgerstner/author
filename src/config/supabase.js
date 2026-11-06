// Supabase settings for the author submission page.
//
// These values are SAFE to commit: the anon/publishable key is designed to be
// public. What protects your bucket is (1) Supabase checking the hCaptcha
// before it issues a temporary anonymous login, and (2) the Storage policy
// (see docs/AUTHOR_SUBMISSIONS_SETUP.md), which only lets those logins ADD
// files — never list, download, overwrite, or delete them.
//
// Never put the "service_role" / "secret" key here.
//
// You can either paste your values below, or set REACT_APP_SUPABASE_URL and
// REACT_APP_SUPABASE_ANON_KEY as environment variables at build time.

export const SUPABASE_URL =
    process.env.REACT_APP_SUPABASE_URL || 'https://YOUR-PROJECT-REF.supabase.co';

export const SUPABASE_ANON_KEY =
    process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR-SUPABASE-ANON-OR-PUBLISHABLE-KEY';

// Your OWN hCaptcha site key (free at https://dashboard.hcaptcha.com).
// Its matching secret goes in Supabase: Authentication -> Attack Protection.
// (The Contact page's key belongs to Web3Forms and can't be used here.)
export const HCAPTCHA_SITE_KEY =
    process.env.REACT_APP_HCAPTCHA_SITE_KEY || 'YOUR-HCAPTCHA-SITE-KEY';

// Name of the (private) Storage bucket that receives submissions.
export const SUBMISSIONS_BUCKET = 'author-submissions';

// Supabase free plan caps a single upload at 50 MB.
export const MAX_EPUB_BYTES = 50 * 1024 * 1024;

export const isSupabaseConfigured = () =>
    !SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
    !SUPABASE_ANON_KEY.startsWith('YOUR-') &&
    !HCAPTCHA_SITE_KEY.startsWith('YOUR-');
