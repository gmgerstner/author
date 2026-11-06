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

## 2. Turn on the captcha (hCaptcha, free)

The page shows an hCaptcha, the same widget as the Contact page. Supabase checks it on its
own servers before it gives the browser a temporary *anonymous login*, and only those logins
can upload. So a bot that skips the captcha can't upload, even though the public key is in
the site's code.

1. Sign up free at <https://dashboard.hcaptcha.com> (no credit card). Add a site with
   the hostname `gmgnovels.com` (plus `localhost` if you want to test locally).
   Copy the **Site key**, and from your account settings copy the **Secret key**.
   > The Contact page's key belongs to Web3Forms. You need your own here because Supabase
   > needs the matching secret.
2. In Supabase: **Authentication → Sign In / Providers** → turn on
   **Allow anonymous sign-ins** → Save.
3. In Supabase: **Authentication → Attack Protection** → turn on
   **Enable Captcha protection**, choose **hCaptcha**, paste the **Secret key** → Save.

## 3. Allow uploads only (no reading, listing or deleting)

Go to **SQL Editor** → **New query**, paste this, and click **Run**:

```sql
create policy "Captcha-verified visitors can submit books"
on storage.objects
for insert
to authenticated
with check ( bucket_id = 'author-submissions' );
```

That's the only policy needed. It's granted to `authenticated` (people who passed the
captcha), **not** `anon`. Because there is no `select`, `update` or `delete` policy,
visitors can add files but can't see, overwrite, or remove anything. You (as the project
owner) still see everything in the dashboard.

> If you already created an earlier policy granted to `anon`, delete it under
> **Storage → Policies** so uploads can't skip the captcha.

## 4. Add your keys to the site

In the dashboard go to **Project Settings → API** (or **API Keys**) and copy:

- **Project URL** — e.g. `https://abcdefgh.supabase.co`
- **anon public** key (or the **publishable** key, `sb_publishable_...`)

Paste them, along with your **hCaptcha Site key** (not the secret), into
`src/config/supabase.js`. These are all safe to commit because they're meant to be public.
**Never** put the Supabase `service_role` / secret key or the hCaptcha secret in this site.

## 5. Viewing submissions

Dashboard → **Storage** → `author-submissions`. Open a folder, click `info.txt` to read
the details, and download the `.epub` next to it.

## Free-plan notes

- 1 GB total storage and 50 MB per file on the free plan.
- Free projects pause after about a week with no activity; un-pause from the dashboard if
  uploads start failing.
- Each submission creates one anonymous user under **Authentication → Users**. That's
  expected. You can delete them whenever you like; it doesn't affect the uploaded files.
  The free plan allows 50,000 monthly active users, far more than you'll need.
- Supabase limits anonymous sign-ins to 30 per hour per IP address by default, which also
  slows down abuse.
- Besides the captcha, the page has a hidden honeypot field and a `noindex` tag so search
  engines skip it. Because it isn't linked anywhere, only people you share the link
  with should find it.
