# Author Submission Page — Supabase Setup

The unlisted page at **`/author-submit-k7m2`** lets authors send their book details and an
EPUB. Everything runs in the browser and uploads straight to Supabase Storage — no backend
server, and nothing beyond the Supabase **free plan** is needed.

Each submission creates its own folder in the bucket:

```
author-submissions/
  2026-11-06T18-04-12-345Z_my-book-title_a1b2c3/
    my-book-title.epub
    info.txt      ← author, email, title, series, genres, blurb, notes, EPUB filename
```

## 1. Create the bucket

1. Open your project at <https://supabase.com/dashboard> → **Storage** → **New bucket**.
2. Name: `author-submissions`
3. **Public bucket: OFF** (keep it private so nobody can download the books).
4. Under additional settings (optional but recommended):
   - **File size limit:** `50 MB` (the free-plan maximum)
   - **Allowed MIME types:** `application/epub+zip, text/plain`

## 2. Allow uploads only (no reading, listing or deleting)

Go to **SQL Editor** → **New query**, paste this, and click **Run**:

```sql
create policy "Public can submit books"
on storage.objects
for insert
to anon, authenticated
with check ( bucket_id = 'author-submissions' );
```

That's the only policy needed. Because there is no `select`, `update` or `delete` policy,
visitors can add files but can't see, overwrite, or remove anything. You (as the project
owner) still see everything in the dashboard.

## 3. Add your project URL and public key

In the dashboard go to **Project Settings → API** (or **API Keys**) and copy:

- **Project URL** — e.g. `https://abcdefgh.supabase.co`
- **anon public** key (or the **publishable** key, `sb_publishable_...`)

Paste them into `src/config/supabase.js`. These are safe to commit — they're meant to be
public. **Never** use the `service_role` / secret key in this site.

## 4. Viewing submissions

Dashboard → **Storage** → `author-submissions`. Open a folder, click `info.txt` to read
the details, and download the `.epub` next to it.

## Free-plan notes

- 1 GB total storage and 50 MB per file on the free plan.
- Free projects pause after about a week with no activity; un-pause from the dashboard if
  uploads start failing.
- The page has a hidden honeypot field to deter basic spam bots and a `noindex` tag so
  search engines skip it. Because it isn't linked anywhere, only people you share the link
  with should find it.
