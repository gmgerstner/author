// Supabase settings for the author submission page.
//
// These values are SAFE to commit: the anon/publishable key is designed to be
// public. What protects your bucket is the Storage policy you create in the
// Supabase dashboard (see docs/AUTHOR_SUBMISSIONS_SETUP.md), which only lets
// visitors ADD files — never list, download, overwrite, or delete them.
//
// Never put the "service_role" / "secret" key here.
//
// You can either paste your values below, or set REACT_APP_SUPABASE_URL and
// REACT_APP_SUPABASE_ANON_KEY as environment variables at build time.

export const SUPABASE_URL =
    process.env.REACT_APP_SUPABASE_URL || 'https://YOUR-PROJECT-REF.supabase.co';

export const SUPABASE_ANON_KEY =
    process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR-SUPABASE-ANON-OR-PUBLISHABLE-KEY';

// Name of the (private) Storage bucket that receives submissions.
export const SUBMISSIONS_BUCKET = 'author-submissions';

// Supabase free plan caps a single upload at 50 MB.
export const MAX_EPUB_BYTES = 50 * 1024 * 1024;

export const isSupabaseConfigured = () =>
    !SUPABASE_URL.includes('YOUR-PROJECT-REF') && !SUPABASE_ANON_KEY.startsWith('YOUR-');
