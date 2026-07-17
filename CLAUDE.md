# Creative Builders — Admin CRUD & Laravel Backend Spec

Angular 17 frontend for a construction company. It has a public marketing site (`src/app/customer-app/`)
and an admin panel (`src/app/administration/`). This document specifies **every CRUD in the admin panel**
and the Laravel backend that must serve it.

## Current state (read this first)

**No admin component calls the backend yet.** `ApiService` exists at
[api.service.ts](src/app/Services/api.service.ts) but is imported by zero components. Every admin screen is a
static placeholder: forms are plain HTML with `name=` attributes (mostly no `ngModel`), tables render
hardcoded rows, and "Save" buttons are `console.log` + `alert` or plain `routerLink` anchors.

So this file is **not a description of an existing contract — it is the contract to build against.** The
field names below are extracted from the actual form inputs and table columns, so the backend built from this
spec will line up when the Angular components are wired to `ApiService`.

## Stack & conventions

| Thing | Value |
| --- | --- |
| API base URL | `http://localhost:5555/api` (from [environment.ts](src/environments/environment.ts) → `apiUrl`) |
| Auth | Bearer token in `Authorization` header; use **Laravel Sanctum** |
| Token storage | `localStorage`/`sessionStorage` under key `token` ([auth.service.ts](src/app/Services/auth.service.ts)) |
| Request body | JSON (`Content-Type: application/json`) |
| Extra header | `ngrok-skip-browser-warning: true` — must not break CORS; allow it |
| Case convention | **camelCase in JSON**, snake_case in the DB. Use API Resources to convert. The Angular models are camelCase (`buttonText`, `blockNo`, `clientName`) — do not send snake_case. |

`ApiService<T>` supports exactly these calls, and the backend must match them:

```
getAll(endpoint)         GET    /api/{endpoint}        → T[]   (a bare array, not an envelope)
getById(endpoint)        GET    /api/{endpoint}        → T
create(endpoint, model)  POST   /api/{endpoint}        → T
update(endpoint, model)  PUT    /api/{endpoint}        → T
delete(endpoint)         DELETE /api/{endpoint}        → 204
```

Two consequences worth designing around:

1. **`getAll` expects a raw JSON array**, not `{ data: [...] }`. Either return `Model::all()` directly or
   have the Angular side unwrap. Pick one now — returning bare arrays is the smaller change.
2. **`ApiService` sends `Content-Type: application/json`, so it cannot upload files.** Many screens have image
   uploads. Choose one:
   - **(Recommended)** Add an `upload()` method to `ApiService` that uses `FormData` and the existing
     `getUploadHeaders()` (which already omits `Content-Type` — it was clearly written for this). Backend
     accepts `multipart/form-data` and returns `{ url }`. Store images via `Storage::disk('public')`.
   - Or accept base64 data URLs in the JSON body and decode server-side. `add-site-info` already produces
     base64 receipts, so the backend should tolerate this for receipts at minimum.

A `401` from any endpoint triggers `AuthService.logout()` on the frontend, so return `401` (not `403`) for
expired/invalid tokens.

### Error format

Laravel's default `422` shape works with a small frontend change; standardize on:

```json
{ "message": "The heading field is required.", "errors": { "heading": ["The heading field is required."] } }
```

## Auth

The login page ([login.component.html](src/app/auth/login/login.component.html)) is unwired — the submit is an
`<a href="#">`. It collects **email**, **password**, and a **Remember me** checkbox (which maps to
`AuthService.setToken(token, rememberMe)` → localStorage vs sessionStorage).

| Method | Endpoint | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/login` | `email`, `password` | `{ token, user }` |
| POST | `/api/logout` | — | 204 |
| GET | `/api/me` | — | current user |

There is a single admin user (the sidebar and dashboard hardcode `Mr. Chaudhry Waqas`). No registration
screen exists — seed the admin user. All routes below sit behind `auth:sanctum`.

---

# Entities

Two groups: **public website content** (what the marketing site renders) and **internal operations**
(sites, site info, materials — the actual construction bookkeeping, admin-only, not rendered publicly).

## Group A — Public website content

### 1. Banner
Screens: [add-banner](src/app/administration/banner/add-banner/add-banner.component.html) · [banner-table](src/app/administration/banner/banner-table/banner-table.component.html) · Routes `add-banner`, `banner-list`

| Field | Type | Rules | Source |
| --- | --- | --- | --- |
| `tagline` | string | nullable | form |
| `heading` | string | **required** | form |
| `description` | text | **required** | form |
| `image` | string (path) | **required**, image, max 2MB | form (file, rec. 1920×600) |
| `buttonText` | string | nullable | **table only — no form input exists.** Add the input or drop the column. |

Endpoints: `GET|POST /api/banners`, `GET|PUT|DELETE /api/banners/{id}`.
Public: `GET /api/public/banners`.

### 2. About Company — **singleton**
Screen: [add-about-company-details](src/app/administration/about-company/add-about-company-details/add-about-company-details.component.html) · Route `company-details`

One record, edited in place. No list, no create.

| Field | Type | Rules |
| --- | --- | --- |
| `image` | string (path) | nullable |
| `sectionLabel` | string | nullable (e.g. "ABOUT COMPANY") |
| `mainHeading` | string | **required** |
| `mainDescription` | text | **required** |
| `feature1`, `feature2`, `feature3` | string | nullable — three fixed slots, not a dynamic list |
| `foundationDescription` | text | nullable |

Endpoints: `GET /api/about-company`, `PUT /api/about-company` (upsert — never 404; return an empty record if
none exists yet, or seed one row).

### 3. Why Choose Us — **singleton**
Screen: [add-why-choose-us](src/app/administration/why-choose-us/add-why-choose-us/add-why-choose-us.component.html) · Route `why-choose-us`

| Field | Type | Rules |
| --- | --- | --- |
| `sectionLabel` | string | **required** |
| `mainHeading` | string | **required** |
| `mainDescription` | text | **required** |
| `mainImage` | string (path) | **required** |
| `feature1Title` … `feature3Title` | string | **required** |
| `feature1Description` … `feature3Description` | text | **required** |

The UI labels this "Feature Items (3 Items)" and hardcodes exactly 3 — flat columns are fine; a
`why_choose_us_features` child table is only worth it if you plan to make the count dynamic.

Endpoints: `GET /api/why-choose-us`, `PUT /api/why-choose-us` (upsert).

### 4. Contact Details — **singleton**
Screen: [contact-details](src/app/administration/contact-details/contact-details.component.html) · Route `contact-details`

| Field | Type | Rules |
| --- | --- | --- |
| `phone` | string | **required** (e.g. `+92 324 7588007`) |
| `email` | string | **required**, email |
| `address` | text | **required** |
| `facebook`, `twitter`, `instagram`, `linkedin` | string (url) | nullable, url |

Endpoints: `GET /api/contact-details`, `PUT /api/contact-details` (upsert).

### 5. FAQ
Screens: [add-faq](src/app/administration/faq/add-faq/add-faq.component.html) · [faq-table](src/app/administration/faq/faq-table/faq-table.component.html) · Routes `add-faq`, `faq-list`

| Field | Type | Rules |
| --- | --- | --- |
| `question` | string | **required** |
| `answer` | text | **required** |

Endpoints: `GET|POST /api/faqs`, `GET|PUT|DELETE /api/faqs/{id}`.

Note: the public services page renders its own 4-item FAQ accordion. Decide whether those are the same
entity (add a nullable `serviceDetailId` / `group` column) or hardcoded page content.

### 6. Gallery
Screens: [add-gallery-item](src/app/administration/gallery/add-gallery-item/add-gallery-item.component.html) · [gallery-table](src/app/administration/gallery/gallery-table/gallery-table.component.html) · Routes `add-gallery-item`, `gallery-item-list`

| Field | Type | Rules |
| --- | --- | --- |
| `image` | string (path) | **required** |
| `title` | string | **table renders it; the form does not collect it.** Make it nullable or add a per-image title input. |
| `siteId` | FK → `sites` | **required** — the form has a "Select Site" dropdown |

The add form is a **multi-file upload** (one submit → many gallery rows, all sharing the selected site).
Support `POST /api/gallery` with an array of images, or have the frontend POST once per file.

Endpoints: `GET|POST /api/gallery`, `GET|PUT|DELETE /api/gallery/{id}`.

### 7. Testimonials
Screens: [add-testimonials](src/app/administration/testimonials/add-testimonials/add-testimonials.component.html) · [testimonials-table](src/app/administration/testimonials/testimonials-table/testimonials-table.component.html) · Routes `add-testimonials`, `testimonials-list`

| Field | Type | Rules |
| --- | --- | --- |
| `clientImage` | string (path) | nullable (form uploads it; table does not show it) |
| `clientName` | string | **required** |
| `designation` | string | **required** (e.g. "Homeowner", "Architect") |
| `feedback` | text | **required** |
| `rating` | tinyint | **required**, `integer|between:1,5` — the select emits `"1"`…`"5"` |

Endpoints: `GET|POST /api/testimonials`, `GET|PUT|DELETE /api/testimonials/{id}`.

⚠️ The table's "Add Testimonial" button links to `../add-testimonial` (singular) but the route is
`add-testimonials` (plural) — a dead link. Frontend bug, worth fixing when wiring.

### 8. Team Members
Screens: [add-team-member](src/app/administration/our-team/add-team-member/add-team-member.component.html) · [our-team-table](src/app/administration/our-team/our-team-table/our-team-table.component.html) · Routes `add-team-member`, `team-member-list`

| Field | Type | Rules |
| --- | --- | --- |
| `photo` | string (path) | nullable |
| `name` | string | **required** |
| `position` | string | **required** (e.g. "Construction Engineer") |
| `email` | string | **required**, email |
| `phone` | string | **required** |
| `siteId` | FK → `sites` | **required** — "Select Site" dropdown |

Endpoints: `GET|POST /api/team-members`, `GET|PUT|DELETE /api/team-members/{id}`.

### 9. Services
Screens: [add-service](src/app/administration/services/add-service/add-service.component.html) · [services-table](src/app/administration/services/services-table/services-table.component.html) · Routes `add-service`, `service-list`

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | **required** |
| `description` | text | **required** |
| `icon` | string (path) | nullable — **rendered on the public homepage, not in the admin form** |
| `tag` | string | nullable — public cards show a "Popular" badge; no admin input |

Endpoints: `GET|POST /api/services`, `GET|PUT|DELETE /api/services/{id}`.

### 10. Service Details — **singleton page content**
Screen: [add-services-detail](src/app/administration/services/add-services-detail/add-services-detail.component.html) · Route `add-service-detail`

**Important relational finding:** despite the name, this is *not* a child of a service. The route has no
`:id`, the form has no service selector, and the services table links to it with no id. It is the content of
the single public `/services` page ([services.component.html](src/app/customer-app/services/services.component.html)).

Build it as a singleton (`GET|PUT /api/service-details`). If you want per-service detail pages later, add a
nullable `serviceId` FK now — the frontend supplies nothing today.

| Field | Type | Rules |
| --- | --- | --- |
| `mainTitle` | string | **required** |
| `mainDescription` | text | **required** |
| `heroImage` | string (path) | **required** |
| `detail1Title`–`detail3Title` | string | **required** — "Detail Sections (3 Cards)" |
| `detail1Description`–`detail3Description` | text | **required** |
| `secondaryImage` | string (path) | **required** |
| `benefitsTitle` | string | **required** |
| `benefitsDescription` | text | **required** |
| `servicesHeading` | string | **required** |
| `servicesDescription` | text | **required** |
| `benefit1Title`–`benefit6Title` | string | **required** — "Benefits Cards (6 Items)" |
| `benefit1Description`–`benefit6Description` | text | **required** |

The 3 detail cards and 6 benefit cards are flat numbered fields in the UI. Flat columns match the form; child
tables (`service_detail_cards`, `service_detail_benefits` with `sortOrder`) are cleaner and let you add the
per-benefit `icon` the public page renders but the admin form never collects.

---

## Group B — Internal operations (the real domain)

This is the construction bookkeeping. Admin-only; nothing here is public.

### 11. Sites
Screens: [add-site](src/app/administration/my-sites/add-site/add-site.component.html) · [sites-table](src/app/administration/my-sites/sites-table/sites-table.component.html) · Routes `add-site`, `site-list`

`sites` is the **central entity** — gallery items, team members, site info, and material purchases all point
at it. Today the site list is hardcoded in five places as the strings `Rizwan Heights`, `Ali's Home`,
`Lodhi's Arcade`. Build a real table and serve the dropdowns from `GET /api/sites`.

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | **required** |
| `location` | string | **required** (note: the input's `name` attr is wrongly `mobile` — a copy-paste bug) |
| `type` | enum | `Home` \| `Office` \| `Building` |
| `status` | enum | `Pending` \| `Completed` \| `Dispute` |
| `budget` | decimal(15,2) | **required** — "Total Budget" |
| `advance` | decimal(15,2) | **required** — "Advance Received" |
| `remaining` | decimal(15,2) | **computed**, do not trust the client: `budget − advance − SUM(sitePayments.amount)` |

**Child: `site_payments`** (dynamic add/remove rows on the add-site form)

| Field | Type | Rules |
| --- | --- | --- |
| `siteId` | FK | **required** |
| `date` | date | **required** |
| `amount` | decimal(15,2) | **required** |
| `description` | string | nullable — exists in the TS model but has no input rendered |

Accept payments nested in the site payload (`POST /api/sites` with `payments: [...]`) — the UI edits them
inline with the site, not separately.

Endpoints: `GET|POST /api/sites`, `GET|PUT|DELETE /api/sites/{id}`.
The table filters by search (name/location) and status client-side, so returning all sites is fine.

### 12. Site Info
Screens: [add-site-info](src/app/administration/site-info/add-site-info/add-site-info.component.html) · [site-info-table](src/app/administration/site-info/site-info-table/site-info-table.component.html) · Routes `add-site-info`, `site-info-table`, `view-site-info`

**The largest and most important CRUD.** A site info record is a per-site cost sheet with three children.
It belongs to a site (chosen via the "Select Site" dropdown).

| Field | Type | Rules |
| --- | --- | --- |
| `siteId` | FK → `sites` | **required** |
| `dateStarted` | date | nullable |
| `dateEnded` | date | nullable |
| `blockNo` | string | nullable — **string, not int** (sample values `'A'`, `'B'`) |
| `streetNo` | string | nullable |
| `houseNo` | string | nullable — "House/Plaza No." |
| `status` | enum | `Pending` \| `Completed` \| `Dispute` (shown in the table) |
| `mukadam` | string | nullable — in the Urdu translation map, no input yet |
| `ownerName` | string | nullable — same |

**Child A: `site_info_items`** — the cost sheet. 51 predefined line items, each with rate/qty/total.

| Field | Type | Notes |
| --- | --- | --- |
| `siteInfoId` | FK | |
| `itemName` | string | one of the 51 names below |
| `section` | enum `left`\|`middle`\|`right` | **purely a print-layout device** — 3 columns × 17 rows on one page. Not 3 entities. Keep it (plus `sortOrder`) only to reproduce the layout. |
| `sortOrder` | int | |
| `rate` | decimal(15,2) | nullable |
| `quantity` | decimal(10,2) | nullable |
| `total` | decimal(15,2) | **computed** `rate × quantity` — recompute server-side |

Seed the 51 item names (a superset of the materials catalogue — it includes labor lines):

- **left:** A, Bore Work, Excavation Work, Backfilling Work, Gera, Steel Wire, Basement Rooftop, Shuttering Flat Film, Shuttering (Ground Floor), Shuttering (First Floor), Steel Work Labor, Chunai Labor, Kacha Labor, Plaster, Aluminum, Cameras, Geaser
- **middle:** Electric Pipes, Electric Wire, Electrician Amount, Electric Fitting, Fans, Lights etc, Sanitary Pipes, Sanitory Labor, Sanitory Materials, Paint, Painter Amount, Peeling, Graphing, Ceiling, Stairs Marble, SS Reiling, Wall Paper
- **right:** Marble, Marble Labor, Tiles, Tiles Labor, Door Lock, Chips, Chips Work, Bond, Tiff tile, Kitchen Hod, Burner, Glass, Safety Grill, Doors, Cupboards, Lenter Machine, Cost

**Child B: `site_info_attendance`** — the daily attendance/materials sheet. One row per date, 15 numeric columns.

| Column | Header shown |
| --- | --- |
| `date` | Date |
| `engineerSalary` | Engineer's Salary |
| `bajri` / `bajriPayment` | Bajri / Payment |
| `sand` / `sandPayment` | Sand / Payment |
| `bricks` / `bricksPayment` | Bricks / Payment |
| `cement` / `cementPayment` | Cement / Payment |
| `cementMinus` / `cementPlus` | Cement − / Cement + |
| `steel` / `steelPayment` | Steel / Payment |
| `steelPlus` / `steelMinus` | Steel + / Steel − |

All 15 are `decimal(15,2) nullable`. The UI starts with 12 blank rows and totals each column.

**Child C: `site_info_receipts`** — multi-image receipt upload.

| Field | Type |
| --- | --- |
| `siteInfoId` | FK |
| `filePath` | string |

Currently stored as base64 data URLs in memory. The backend should accept uploads and return paths.

Endpoints: `GET|POST /api/site-infos`, `GET|PUT|DELETE /api/site-infos/{id}`.
`GET /api/site-infos/{id}` must eager-load `items`, `attendance`, and `receipts` — the edit screen renders all
three at once. Accept the whole graph nested on `POST`/`PUT` (the UI saves the entire sheet in one action).

⚠️ `view-site-info` is an empty stub (`<p>view-site-info works!</p>`) and its route takes no `:id`. The table's
View link goes to `../view-site-info` with no id. Add `:id` when wiring.

**i18n:** the sheet has an English⇄Urdu toggle (client-side map). If translations move server-side, item names
need a `nameUr` column.

### 12b. Instant Entry
Screen: [instant-entry](src/app/administration/instant-entry/instant-entry.component.html) · Route `instant-entry`

A shortcut for adding **one cost line at a time to a site**, without opening the full site-info sheet. Same
data as a `site_info_items` row — it is not a new entity, it is a fast write path into the existing one.

The form has four inputs plus a computed total:

| Field | Control | Rules |
| --- | --- | --- |
| `siteId` | dropdown, from `GET /api/sites` | **required** |
| `itemName` | searchable dropdown, the same 51 items as the site-info sheet | **required** |
| `section` | not user-facing — carried along with the chosen item (`left`\|`middle`\|`right`) | derived |
| `rate` | number | **required** |
| `quantity` | number | **required** |
| `total` | readonly | **computed** `rate × quantity` — recompute server-side, never trust the client |

The UI lets the user stack up several rows in a local table and submit them together (the site stays
selected between adds), so the payload is an **array**:

```
POST /api/instant-entries
[
  { "siteId": 1, "itemName": "Cement", "section": "left", "rate": 1150, "quantity": 20 },
  { "siteId": 1, "itemName": "Marble", "section": "right", "rate": 120, "quantity": 300 }
]
```

**Backend behavior — the important part.** Each entry must land in the site's item sheet:

1. Resolve the site's **current** `site_info` record (the open/most recent one for that `siteId`). If the site
   has none, create one — an instant entry must never fail because the sheet does not exist yet.
2. Find the `site_info_items` row for that `itemName`. Decide and stick to one rule:
   - **Upsert (recommended):** the item sheet has exactly one row per item name, so overwrite its
     `rate`/`quantity`/`total`. This matches how the sheet renders today (51 fixed rows).
   - **Append:** allow multiple rows per item and let the sheet sum them. This needs the sheet UI to change,
     so only pick it if repeated purchases of the same item must be kept as separate lines.
3. Recompute `total` and return the affected rows.

Validate `itemName` against the seeded 51-item list — reject unknown names rather than silently creating rows.

Note the site dropdown here has the same problem as everywhere else: it currently carries a site **name
string**, not an id. Send `siteId` once `GET /api/sites` exists.

### 13. Materials
Screens: [materials-table](src/app/administration/materials/materials-table/materials-table.component.html) · [view-materials-details](src/app/administration/materials/view-materials-details/view-materials-details.component.html) · Routes `materials-list`, `view-material-details/:id`

**There is no add/edit material form anywhere in the app** — materials are a read-only seeded catalogue.
Build full CRUD endpoints anyway (an admin form will be needed), but the catalogue can be seeded.

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | **required** |
| `unit` | string | **required** — Bags, Ton, Pieces, Trolley, Sq Ft, Box, Gallon, Roll, Bundle, Kg, Set |
| `rate` | decimal(15,2) | **required** (PKR; all samples are whole numbers) |
| `stock` | int | **required** |

Seed (20 rows, from the component): Cement/Bags/1150/200 · Steel/Ton/250000/15 · Bricks/Pieces/18/50000 ·
Sand/Trolley/18000/30 · Bajri/Trolley/22000/25 · Marble/Sq Ft/120/5000 · Tiles/Box/1800/300 ·
Paint/Gallon/4500/50 · Electric Wire/Roll/6500/40 · Electric Pipes/Bundle/3200/60 ·
Sanitary Pipes/Bundle/4500/35 · Aluminum/Sq Ft/550/1500 · Plaster/Bags/450/100 · Steel Wire/Kg/280/500 ·
Chips/Trolley/15000/20 · Fans/Pieces/7500/30 · Lights etc/Set/2500/80 · Door Lock/Pieces/3500/25 ·
Geaser/Pieces/18000/5 · Cameras/Pieces/8500/12

**Child: `material_purchases`** — the per-material purchase ledger driving `view-material-details/:id`.
Currently randomly generated client-side; this is the table that must replace it.

| Field | Type | Notes |
| --- | --- | --- |
| `materialId` | FK → `materials` | |
| `siteId` | FK → `sites` | the detail page filters by site |
| `date` | date | filtered by a from/to range |
| `quantity` | decimal(10,2) | |
| `rate` | decimal(15,2) | rate *at purchase time*, not the catalogue rate |
| `total` | decimal(15,2) | computed `quantity × rate` |
| `supplierId`/`supplier` | — | **not built, but intended**: the component declares an unused `suppliers` array (Lucky Cement, Amreli Steel, …). Add a nullable `supplier` column now. |

`GET /api/materials/{id}/purchases?siteId=&dateFrom=&dateTo=` should return the filtered rows plus the
summary the page shows: `totalQuantity`, `totalAmount`, `averageRate`.

Endpoints: `GET|POST /api/materials`, `GET|PUT|DELETE /api/materials/{id}`,
`GET /api/materials/{id}/purchases`.

### 14. Dashboard
Screen: [dashboard](src/app/administration/dashboard/dashboard.component.html) · Route `dashboard`

All values hardcoded. One endpoint — `GET /api/dashboard` — should return:

| Key | Meaning |
| --- | --- |
| `totalEarning` | SUM of money received: `sites.advance` + all `site_payments.amount` |
| `totalSpent` | SUM of expenses: `site_info_items.total` + attendance payments |
| `totalProjectsAmount` | `SUM(sites.budget)` |
| `totalSites` | `COUNT(sites)` |
| `totalServices` | `COUNT(services)` |
| `totalTeamMembers` | `COUNT(team_members)` |
| `totalMaterials` | `COUNT(materials)` |
| `recentSites[]` | latest N sites: `name`, `type`, `location`, `status` |

Amounts are PKR. No charts exist on the dashboard — only stat cards and a recent-sites table.

### 15. Profile Settings
Screen: [profile-settings](src/app/administration/profile-settings/profile-settings.component.html) · Route `profile-settings`

Edits the logged-in admin user.

| Field | Type | Rules |
| --- | --- | --- |
| `logo` | string (path) | nullable |
| `name` | string | **required** |
| `email` | string | **required**, email, unique |
| `companyName` | string | **required** |
| `phone` | string | **required**, pattern `[+0-9 ]{7,20}` |

⚠️ The company-name and mobile-number inputs are copy-paste duplicates — **both** carry `id="number"` and
`name="phone"`. They are meant to be two distinct fields. Fix the HTML when wiring.

Endpoints: `GET /api/profile`, `PUT /api/profile`. No password-change UI exists yet.

---

## Migration order

Respect the FKs:

1. `users`
2. `sites` → `site_payments`
3. `site_infos` → `site_info_items`, `site_info_attendance`, `site_info_receipts`
4. `materials` → `material_purchases` (FK to both `materials` and `sites`)
5. `banners`, `faqs`, `testimonials`, `services`, `service_details`
6. `gallery_items`, `team_members` (FK → `sites`)
7. Singletons: `about_company`, `why_choose_us`, `contact_details`

Singletons should be seeded with one empty row so `GET` never 404s and `PUT` is a plain update.

## Decisions to make before coding

1. **File uploads** — add a multipart `upload()` to `ApiService` (recommended) vs base64 in JSON. Blocks
   banners, about-company, why-choose-us, gallery, testimonials, team members, service details, receipts.
2. **`getAll` response** — bare array (matches `ApiService<T>` today) vs `{ data: [] }` envelope (requires an
   Angular change).
3. **Fixed slots vs child tables** — about-company's 3 features, why-choose-us's 3 features, service-details'
   3 cards + 6 benefits. Flat columns mirror the current UI exactly; child tables are cleaner and needed if
   the counts ever become dynamic.
4. **Site dropdowns** — every "Select Site" is currently a fake div-based dropdown holding a *name string*,
   not an id. The backend must expose `GET /api/sites` and the frontend must send `siteId`.
5. **Service ↔ service detail** — currently unrelated (singleton page content). Add a nullable `serviceId`
   now if per-service pages are planned.
6. **Instant entry: upsert or append?** Whether a second entry for the same item on the same site overwrites
   the existing item-sheet row or adds another line. Upsert matches the current sheet UI (51 fixed rows).

## Frontend bugs to fix while wiring

- `add-site`: the Location input's `name` attr is `mobile`.
- `profile-settings`: two inputs share `id="number"` / `name="phone"` (Company Name + Mobile Number).
- `testimonials-table`: links to `../add-testimonial`, route is `add-testimonials`.
- `site-info-table`: View link has no `:id`; `view-site-info` is an empty stub.
- `header`: Logout navigates to `/login` without calling `AuthService.logout()` — the token is never cleared.
- `gallery`: table shows a Title column the add form never collects.
- Most forms have no `ngModel`/`FormsModule` at all (`why-choose-us`, `profile-settings`, `add-faq`,
  `add-service`, `add-services-detail`, gallery/team selects) — values live only in the DOM. These need
  template-driven or reactive forms before any of this API can be called.
