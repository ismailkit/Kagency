# Programmatic publishing (for Claude Code / automation)

Publish case studies and other content into Payload **through the REST API** —
validation, hooks (auto-slug, SEO, image sizes) all run, and upserts are **by
slug** so re-running updates instead of wiping. This is the supported alternative
to the destructive `seed` scripts.

## 1. One-time setup

1. In the admin (`/admin`), open **Account → API Key → Enable API Key**, save, and
   copy the key. The key inherits that user's role, so use an **admin** or
   **editor** user (required by the content access rules).
2. Set environment variables when running the scripts:

   ```bash
   # local
   export PAYLOAD_URL=http://localhost:3000
   export PAYLOAD_API_KEY=<the key>

   # …or live
   export PAYLOAD_URL=https://kagency.dev
   export PAYLOAD_API_KEY=<the key>
   ```

## 2. Discover the fields

```bash
npm run publish:schema            # projects (default)
npm run publish:schema -- services
```

Prints every field (name, type, required, relationship target, select options,
including the SEO `meta.*` fields the plugin adds). Use this to know what to fill.

## 3. Publish a project

Author a JSON spec (see `example-project.json`) then:

```bash
npm run publish:project -- scripts/publish/example-project.json
```

- **Images** (`coverImage`, `gallery[].src`, `meta.imageSrc`) are local paths
  (relative to repo root) **or** `http(s)` URLs — uploaded automatically.
- **`contentMarkdown`** is converted to the editor's Lexical format (headings,
  lists, bold/italic, links, blockquotes, etc.), so it's still editable in admin.
- **`services`** are matched by **title** → relationship ids (unknown ones are
  skipped with a warning).
- Upsert is by **`slug`** (auto-derived from `title` if omitted). Re-running with
  the same slug updates the existing project — never deletes the collection.

### Spec format

```jsonc
{
  "slug": "ova-skincare",            // optional; derived from title if omitted
  "title": "Ova Skincare",           // required
  "client": "Ova",                   // required
  "category": "brand",               // required: design|development|brand|strategy|other
  "summary": "One–two line teaser.", // required (also the default meta description)
  "role": "Brand strategy · Web design & build",
  "timeline": "2026 · 6 weeks",
  "projectUrl": "https://ova.example",
  "featured": true,
  "publishedAt": "2026-06-01T00:00:00.000Z",
  "services": ["Branding", "Web Development"],   // matched by title
  "coverImage": { "src": "./media/ova-cover.jpg", "alt": "Ova packaging" },
  "gallery": [
    { "src": "https://…/ova-1.jpg", "alt": "Hero", "caption": "Landing page" }
  ],
  "contentMarkdown": "## The challenge\n\nText…\n\n## The approach\n\n- point\n- point\n\n## Results\n\n> A pull quote.",
  "meta": {
    "title": "Ova Skincare — Brand & Web | Kagency",
    "description": "How we rebranded Ova and shipped a new storefront.",
    "useCoverImage": true             // or "imageSrc": "./media/og.jpg"
  }
}
```

> Other collections: the same client (`scripts/publish/payload-client.mjs`)
> exposes `upsertBySlug`, `createDoc`, `updateDoc`, `uploadMedia` for any
> collection — write a thin spec runner like `project.mjs` if you need one.
