# Lawxygen Service Portal — Implementation Plan

## Context

**The problem.** `lawxygen.in` lists 259 legal/CA/CS services across 10 categories and every one of them dead-ends. A visitor can read about Private Limited Company Registration but cannot buy it. The site is a static landing surface with no backend, no auth, and no way to take money.

**What we're building.** A transaction platform at `app.lawxygen.in`, in two new repos, that turns those 259 pages into a funnel:

> client reads a service page → clicks "Get started" → logs in → pays → a qualified professional is **automatically** assigned within seconds → both sides track the matter to completion.

`lawxygen.in` stays exactly as it is: a static marketing site whose only change is that its CTAs now point at `app.lawxygen.in`. It is **not** being migrated, rebuilt, or made dynamic.

**Intended outcome.** A client goes from reading a service page to a paid, assigned matter without anyone at Lawxygen touching it. Admin onboards professionals and reprices services without a developer.

### Decisions locked in this session

| Decision | Choice | Why |
|---|---|---|
| Database | **PostgreSQL + Drizzle** (Neon) | *Reversed from an earlier MongoDB decision.* This is a money system — ledger, gapless invoicing, concurrent assignment. See "Why Postgres" below. **Revert if Mongo was a client mandate.** |
| Backend | **Node.js + Express + Drizzle** | Node/Express chosen by user. |
| Foundation | **Port the existing Phase 0/1 work** | `LAWXYGEN_AGAIN_NEW_UI` already has a tested, migrated foundation. Re-deriving it would be waste. |
| Portal | **Next.js App Router** *(assumed — flag if wrong)* | Reuses the landing page's existing design system and keeps the session cookie httpOnly. |
| Payouts | **Collect 100%, batch payouts later** | Razorpay Route needs ₹40L+ turnover proof under Sept-2025 RBI rules. Ledger records the pro's share as a liability at capture; switching to Route later needs no migration. |
| Catalogue | **Backend stores pricing only; marketing pages stay static** | Zero SEO risk to 259 ranking URLs. Keyed on `(category, slug)` — see the collision note in M1. |
| Realtime | **Polling (~15s)** *(assumed — flag if wrong)* | Meets "within seconds", no connection state. Sockets drop in later on the same event seam. |
| WhatsApp | **Deferred to Phase 2** | User is still deciding the approach. v1 must leave a clean seam — see below. |

### Why Postgres

Four invariants in this system are one-liners in Postgres and hand-built conventions in MongoDB:

| Need | Postgres | What Mongo would have required |
|---|---|---|
| Webhook idempotency | `INSERT … ON CONFLICT (event_id) DO NOTHING` | Unique index + `E11000` catch — **impossible inside a transaction**, where a duplicate key is fatal and uncatchable |
| One professional claimed per order | `SELECT … FOR UPDATE SKIP LOCKED` | Atomic `findOneAndUpdate` claim plus a compensating decrement on failure |
| Gapless GST invoice numbers | Counter row updated in-transaction — rolls back with it, so no gap and no double-allocation | Atomic `$inc` with careful analysis of which aborts burn a number |
| Ledger correctness | `CHECK` constraints, foreign keys, `EXCLUDE USING gist` | Application-level convention; nothing catches a write that bypasses it |

Plus a class of Mongo footgun that simply doesn't exist here: Mongoose's `unique: true` is inert until the index is built, so a production deploy with `autoIndex` off can silently ship with *no* idempotency while every test passes.

### What already exists and gets ported

`LAWXYGEN_AGAIN_NEW_UI` has ~15 self-contained files that nothing in its UI imports — they lift out cleanly:

- `db/schema/auth.ts` — 7 tables (users, accounts, sessions, verification_tokens, password_reset_tokens, otp_challenges, audit_log), 3 enums, partial unique indexes on `lower(email)` and `phone`
- `db/client.ts` — lazy Proxy connection, and Neon pooler detection that sets `prepare: false` (PgBouncer transaction mode breaks prepared statements intermittently under load)
- `lib/auth/policy.ts` — `authorize(actor, action, {minimumRole, ownerUserId})`, role ranks, and the impersonation blocklist that refuses `payout.release` / `refund.approve` outright. 14 unit tests.
- `lib/db-errors.ts` — SQLSTATE extraction through Drizzle's `DrizzleQueryError` wrapper
- `lib/api.ts` — typed error codes and result contract; `lib/env.ts` — Zod-validated env
- `db/migrations/0001_btree_gist.sql` — **`btree_gist` already installed**, with the booking-overlap exclusion constraint written out and proven against a throwaway table in `test/integration/schema.test.ts`

**One simplification the move enables.** The old repo contorted around Auth.js: its Credentials provider forces JWT, which defeats instant revocation, so email/password and OTP were going to be hand-rolled server actions writing the same `sessions` table. In a standalone Express backend there is no Auth.js constraint at all — **own all three sign-in paths directly** against the existing `sessions` schema and use a plain OAuth client for Google. Drops a dependency and the contortion with it.

**Keep the TypeScript 6.0.3 pin.** The reason was never Next-specific: `typescript-eslint` refuses TS 7, and it provides `no-floating-promises` / `no-misused-promises`. On a codebase doing webhooks and payment capture, an unawaited promise is a money bug.

### The WhatsApp seam (deferred, but designed for now)

WhatsApp is out of v1 scope, but three things get built now so Phase 2 is an adapter and not a refactor:

1. **Outbox pattern.** State changes write a domain event in the *same transaction* as the change. Notification channels are subscribers. Adding WhatsApp = adding a subscriber, touching no emitting code.
2. **A `matter thread` concept** on the order, so a conversation has somewhere to attach regardless of channel.
3. **E.164 phone + explicit messaging consent captured at signup.** WhatsApp requires opt-in; collecting it later means re-contacting every existing user. This is the real value of the seam — the code decoupling is secondary.

Research done this session, for whenever Phase 2 starts: Meta's Groups API can put a bot and both parties in one thread, but requires an **Official Business Account** (6+ months trading, 30 days on-platform, press coverage, and since 2026 the request must be submitted by a BSP). A bot **cannot force-add** a number — invite link only. Until the green tick exists, the realistic options are a bot relaying two 1:1 threads, or a plain introduction handoff. From **1 Oct 2026** Meta charges for service messages inside the 24-hour window (1,000 free/month per number), which prices the relay option.

---

## Repo layout

```
lawxygen.in        LAWXYGEN_AGAIN_NEW_UI            static marketing site — UNCHANGED except CTAs
app.lawxygen.in    lawxygen_service_portal          Next.js portal (client/pro/admin)
api.lawxygen.in    lawxygen_service_portal_backend  Express + Drizzle API
```

Both new repos are currently empty (README + `.git` only).

### Backend structure

```
src/
  modules/
    auth/          sessions, OTP, OAuth, guards
    catalogue/     sellable services + pricing
    professionals/ onboarding, verification, availability
    orders/        state machine, client matters
    payments/      Razorpay orders, webhooks, invoices
    ledger/        double-entry lines, reconciliation
    payouts/       batch runs, TDS withholding
    assignment/    claim engine, escalation
    admin/         queues, analytics, overrides
  db/              schema (ported + extended), migrations, client
  lib/             env, errors, money, api contract   <- ported
  jobs/            outbox dispatcher, escalation sweep, reconciliation
  events/          domain event definitions + subscribers
```

---

## Engineering standards

Carried forward from the existing decision log, which stays the project's decision record:

- **Authorization is server-side on every mutation.** Route guards and hidden UI are conveniences, never the boundary.
- **Money is integer minor units (paise).** Never floating point. Currency stored explicitly alongside every amount.
- **The Razorpay webhook is the source of truth** for payment success — never the browser redirect.
- **Migrations are forward-only**, reviewed like code, never destructive in the same release that stops reading a column.
- **External calls are idempotent** — every gateway integration safe to retry, assuming duplicate and out-of-order delivery.
- **Never test `error.code` directly** — Drizzle wraps driver errors, so SQLSTATE lives on `error.cause`. Use the ported `pgErrorCode()` / `isUniqueViolation()` / `isExclusionViolation()`.
- **Privileged actions are audit-logged**: who, what, when, before/after. Append-only.

### Tax treatment — needs a CA, not a guess

A marketplace collecting on behalf of professionals falls under **§194-O** (e-commerce operator), currently **0.1%** of gross — *not* §194J's 10% on professional fees. Where 194-O applies it overrides 194J for the same transaction. Whether Lawxygen is an "e-commerce operator" for this arrangement is a determination for a practising CA.

**Engineering requirement regardless of the answer:** the withholding **section and rate are configuration, not constants**, and every payout record stores which section and rate were applied to it. Getting this wrong retrospectively is expensive; making it configurable is nearly free.

---

## Data and API flow

**This is the part that decides whether the project scales.** Dashboards get redesigned; the wiring does not. Every rule below exists so that a change on one side of the boundary cannot silently break the other.

**The portal never touches the database.** It has no connection string and no ORM. Every read and write goes through the API. This is what keeps authorization in one place and makes the backend independently deployable and independently testable.

**One source of truth for the contract, enforced across two repos.** The backend defines every request and response with a **Zod schema**, which is simultaneously the runtime validator and the type. From those it emits an **OpenAPI document, committed to the repo**; the portal generates its typed client from that file. CI fails the backend build if the committed spec is stale.

> Two separate repos make this harder than a monorepo would — without a shared package there is nothing stopping the portal's hand-written types from drifting out of sync with the API, and that drift shows up as a runtime bug in production rather than a compile error. The generated client is what buys back the compile-time safety. **If the repos ever merge into a monorepo, this whole mechanism collapses into a shared `packages/contract` import and should.**

**Every response uses the same envelope**, the ported `ApiResult<T>` from `lib/api.ts`: `{ ok: true, data }` or `{ ok: false, code, message, fieldErrors? }`, where `code` is a closed union (`unauthenticated`, `forbidden`, `not_found`, `invalid_input`, `conflict`, `rate_limited`, `upstream_failure`, `internal`). The portal switches on `code`, never on message text or HTTP status alone.

**Every list endpoint is cursor-paginated from the first one written.** Retrofitting pagination onto a client that assumed an array is a rewrite of every call site. Same shape everywhere: `{ items, nextCursor }`.

**Authorization is re-checked server-side inside every handler**, via the ported `authorize()`. Route guards and hidden UI are conveniences. A screen that hides a button is not a permission.

**State changes emit domain events through the outbox, in the same transaction as the change.** This is the single extension point: notifications, WhatsApp in Phase 2, analytics, and any future integration attach as subscribers without touching the code that emits. Handlers must be idempotent, because a partial failure re-runs them.

**Resource-shaped endpoints, not screen-shaped ones.** `GET /orders?status=…` rather than `GET /client-dashboard-row-2`. Screen-shaped endpoints have to be rewritten every time a dashboard is redesigned — which, for the professional and admin dashboards, is already planned.

---

## Delivery milestones

Each milestone ends in something demonstrable on staging. Ordered by dependency.

### M0 — Foundations
Port `db/`, `lib/env.ts`, `lib/api.ts`, `lib/db-errors.ts`, `lib/auth/**`, `drizzle.config.ts` and the integration tests from `LAWXYGEN_AGAIN_NEW_UI` into the backend repo. Express skeleton, structured logging, error boundary, health check, CI (typecheck, lint, test, build). Add the `db:generate` / `db:migrate` npm scripts the old repo never had.

Auth end to end, owning all three paths directly against the ported `sessions` table: email+password (argon2), Google OAuth, mobile OTP via a DLT-registered Indian provider. **Server-side sessions, not JWT** — so suspending an account takes effect on the next request and "sign out everywhere" is a `DELETE`. Role guard middleware wrapping the ported `authorize()`. Audit log. **E.164 phone + messaging consent captured at registration.**

Known gaps in the ported code to close: the session callback never populated `impersonatorId` though `requireActor()` reads it; `users.updatedAt` never auto-updates.

> **Exit:** a new user registers on `app.lawxygen.in`, logs in, lands on an empty dashboard; an admin suspending them kills their session on the next request.

### M1 — Catalogue and checkout (no money yet)
`services` table keyed by the **exact slug the marketing site already generates**. The seed must reuse `serviceSlug()` from `LAWXYGEN_AGAIN_NEW_UI/lib/serviceRoutes.ts:1` verbatim:

```ts
service.toLowerCase().replace(/&/g, " and ")
       .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
```

Seed from `data/serviceCatalog.ts` (10 groups, 259 services, each with a category accent colour). The seed asserts every generated slug matches a live marketing route — the old repo already has this check in `lib/serviceRoutes.test.ts`.

> **Slugs are NOT globally unique — verified.** 259 services produce only **237 distinct slugs**: 22 slugs appear in two categories each, covering **44 service rows**. All 22 are the same pairing — a done-for-you service in `tax-compliance` / `intellectual-property` that also exists as a consultation in a `talk-*` category (e.g. `gst-audit-support` in both `tax-compliance` and `talk-ca`; `trademark-objection-reply` in both `intellectual-property` and `talk-ip-lawyer`).
>
> Consequences, all load-bearing:
> - The unique constraint is **`(category_id, slug)`**, not `slug`. A unique index on `slug` alone rejects 44 rows.
> - The deep link must carry both: `app.lawxygen.in/checkout?category=<cat>&service=<slug>`.
> - These are **genuinely different products**, not duplicates — a filing service and a consultation about it, with different prices and different fulfilment. The model needs a `fulfilment_type` (`service` vs `consultation`) and they must be priced separately.

> **Note:** five directories under `app/services/**` contain a literal `u2013` (e.g. `income-tax-return-itr-filing-u2013-individuals`). These are orphans from a generator that read the source's `–` escape as text. They are already 301'd in `next.config.ts`. The seed must produce only the clean slugs.

Categorised browsing and service detail in the portal (price, what's included, turnaround). Marketing site's 259 pages get their single primary CTA. Order created in `payment_pending`.

> **Exit:** a client clicks "Get started" on a live marketing service page and reaches a pre-selected checkout with a real price, producing an order record — including for one of the 22 ambiguous slugs, landing on the correct category's product.

### M2 — Payments
Razorpay order creation server-side. Webhook endpoint with signature verification, idempotency via `ON CONFLICT (event_id) DO NOTHING` on `webhook_events`, and safe handling of **out-of-order delivery** (a `captured` event arriving before the order row is visible must not be dropped; a late `failed` for a superseded attempt must not un-pay a paid order).

Double-entry ledger: commission, professional payable and withholding recorded as lines at capture, with a `CHECK` enforcing that debits equal credits per journal entry. GST-compliant invoice with gapless per-financial-year numbering from a counter row incremented **inside the capture transaction**, so an abort rolls the number back rather than burning it. Both GSTINs, place of supply, SAC code, correct CGST/SGST vs IGST. Failed/abandoned payment leaves the order visible to the client as "payment pending" with a retry path — note `payment_failed` is a distinct internal state that *presents* as "payment pending", because support needs the gateway error code.

Daily reconciliation against Razorpay's settlement report. **Ship this in the same release as capture** — it is the only thing that detects a webhook that never arrived.

> **Exit:** a client pays; the ledger balances; an invoice issues with a correct sequential number; a deliberately duplicated and a deliberately delayed webhook both leave the ledger unchanged.

### M3 — Professionals and the assignment engine
Professional onboarding: profile, category qualifications, credential documents (Bar Council / ICAI / ICSI), admin verification queue, availability and capacity, payout identity (PAN, optional GSTIN, bank details) **encrypted at field level**.

Assignment engine: on confirmed payment, claim exactly one approved + active + category-qualified professional using `SELECT … FOR UPDATE SKIP LOCKED`, load-balanced by open matters against a capacity cap. **An order with no eligible professional must never be lost** — it parks in an `awaiting_assignment` queue visible to admin, and a professional being approved or flipping to available re-drains that queue immediately rather than waiting for a backoff tick. Acknowledgement deadline on an indexed column; a periodic sweep flags unacknowledged matters for reassignment.

> Reminder from the decision log: a Drizzle `one()` relation infers non-nullable from the FK column, so `professional → payoutIdentity` lies — "verified professional with no payout identity" is a real state the eligibility query must exclude by hand.

> **Exit:** a paid order auto-assigns with no human involved; the professional sees it within seconds; concurrent payments never exceed a professional's capacity; an unacknowledged matter appears in the admin queue after the window.

### M4 — Admin console and payouts
Request queue with filtering and manual reassignment override. Professional approval, suspension, commission overrides. Catalogue and pricing management with no deployment. Client account view with **time-boxed, consent-gated, audit-logged** impersonation — the ported policy already refuses payout and refund actions outright while impersonating. Analytics: orders, revenue, category demand, assignment turnaround. Payout batch runs via RazorpayX with withholding applied and per-payout section/rate recorded.

> **Exit:** operations run a full simulated week on staging — publish a service, verify a professional, assign and close matters, approve a refund, release a payout batch — with zero developer involvement and every privileged action attributable to a named admin.

### M5 — Hardening and launch
Field-level encryption and key rotation; rate limiting on auth/OTP by IP and identifier; WAF and strict CSP; backup with a **timed restore drill actually performed**; load test; independent penetration test with critical/high findings closed and retested. Legal documents counsel-reviewed with per-user acceptance recorded. Seeded launch cohort of verified professionals per priority category — a marketplace with no supply is deployed, not launched.

> **Exit:** pen-test retest clean; restore drill inside the stated recovery objective; first genuine client payment settled and first genuine professional payout released and reconciled.

### Phase 2 (post-launch) — WhatsApp
Add a WhatsApp subscriber to the existing outbox. No changes to emitting code. Approach to be decided; research summarised above.

---

## Dashboards

There is no single "dashboards milestone". Each dashboard gains screens in the milestone that makes its data real, so no screen ever displays a number that does not exist yet.

| Dashboard | M0 | M1 | M2 | M3 | M4 |
|---|---|---|---|---|---|
| **Client** | shell, empty state | catalogue, checkout, order list | invoices, payment status, retry | assigned professional, matter tracking | — |
| **Professional** | — | — | — | assignment list, acknowledge, status updates | earnings and pending payout |
| **Admin** | — | — | — | professional verification queue *(hard dependency: assignment cannot work until professionals can be approved)* | request queue, reassignment, catalogue and pricing, analytics, payout runs, impersonation |

**Starting material.** `LAWXYGEN_AGAIN_NEW_UI` has designed static UI for 5 client screens and 7 admin screens, plus `PortalShell`, `PortalSectionPage`, `PortalIcons`, `UserDashboardOverview` and `AdminDashboardOverview` in `components/portal/`. Every figure in them is hardcoded. They port to the portal repo as the visual starting point, and each milestone replaces the mock arrays for its own slice.

**The gap:** there are no professional screens at all. The old repo's middleware protects `/pro/*` but that directory was never created. The professional dashboard is built from scratch in M3.

### Client dashboard — layout

Agreed structure:

```
+---------------------+--------------------------------------------------+
|  [LAWXYGEN]         |                              [ user profile v ]  |
+---------------------+--------------------------------------------------+
|  collapsible menu   |  Good morning, Aarav                             |
|                     |                                                  |
|  search             |  Previously used services          [ See all ]   |
|  all services       |  +------+ +------+ +------+ +------+  >  scroll  |
|  [filter]           |                                                  |
|  my orders          |  New in Lawxygen            (auto-rotating)      |
|  invoices           |  +----------+ +----------+ +----------+          |
|  ...                |                                                  |
|                     |  Services you might need                         |
|                     |  +------+ +------+ +------+ +------+             |
+---------------------+--------------------------------------------------+
```

- **Top left:** Lawxygen mark. **Top right:** user profile menu.
- **Left rail:** collapsible menu of app features. Because there are 10 categories and 259 services, it carries **search**, a **filter**, and a **panel of all services**. Collapsed/expanded state persists per viewer.
- **Main column, in order:** greeting → *Previously used services* (horizontal row, horizontally scrollable when it overflows, **"See all" sits above the row**) → *New in Lawxygen* (auto-rotating) → *Services you might need*.

**Three things this raises that need a decision before M1 builds it:**

1. **Empty state is the common case at launch.** "Previously used services" has nothing in it until a client has paid for something, which is not until M2. Every user is new on day one. The row needs a defined substitute — popular services, or category browse — rather than an empty shelf.
2. **"Services you might need" implies a rule.** Realistic options for v1: same-category as a previous order, or an admin-curated pairing map (company registration → GST registration → annual compliance). A curated map is predictable and sellable; anything learned needs data we will not have. Recommend curated, stored as data so it changes without a deploy.
3. **"New in Lawxygen" needs a source and an accessibility guard.** Source: an admin-settable flag on a service, so marketing controls the row without a deploy. Guard: auto-rotation must pause on hover and on keyboard focus and must respect `prefers-reduced-motion` — the project's cross-cutting standard is WCAG 2.1 AA on client flows, and an un-pausable carousel fails it.

Ordering note: *Previously used services* only becomes meaningful after M2, so M1 builds the rail, search, filter, all-services panel and the two catalogue-driven rows; the history row lands with M2.

### Professional dashboard — feature set

Layout deliberately unspecified; **to be redesigned later**. What matters now is that the API supports every capability below, so a redesign is a UI change and not a backend change.

- **Overview** — active matters, awaiting acknowledgement, earnings this month, pending payout
- **Matter queue** — new (with a visible countdown to the escalation deadline), active, awaiting client, completed. Filter and search.
- **Matter detail** — client contact, service scope, status transitions, documents, internal notes
- **Acknowledge / decline** — the action admin and client both key off
- **Availability and capacity** — available/unavailable toggle and a concurrent-matter cap; feeds the assignment engine's eligibility query directly
- **Earnings** — per-matter fee, commission deducted, withholding applied (with the section and rate that were used), paid vs pending, payout history, downloadable statement
- **Profile** — categories served, qualifications, credential documents and their verification status, payout identity
- **Notifications** — in-app alerts; the same outbox events that will later drive WhatsApp

### Admin dashboard — feature set

Same caveat: **layout to be redesigned**, capability list is the contract.

- **Overview** — orders today/this week, revenue, unassigned queue depth, escalated matters, pending verifications
- **Order queue** — filter by status, category, professional, date; search; manual assign and reassign; escalation view
- **Professional management** — verification queue with credential review and approve/reject, suspend/reactivate, commission override, payout hold, capacity override
- **Client management** — account view, order history, and **time-boxed, consent-gated, fully audited impersonation**; the ported policy already refuses `payout.release`, `refund.approve`, `invoice.reissue`, `user.role.change` and `user.delete` outright while impersonating
- **Catalogue management** — categories, services, pricing, turnaround, active/inactive, the *New in Lawxygen* flag, and the curated *you might need* pairings. All without a deploy.
- **Finance** — payments, refund approval, invoice reissue, payout batch runs, reconciliation exceptions, ledger view
- **Analytics** — revenue and demand by category, assignment turnaround, professional performance, conversion
- **Audit log viewer** — searchable, filterable, immutable
- **Settings** — admin roles, default commission, withholding section and rate, escalation window. These are configuration, not constants in code.

---

## Verification

**Per milestone, on staging, demonstrated not asserted.** The exit criterion is the contract.

Write these concurrency tests *before* the features they cover — they are the ones that lose money silently:

- **Webhook idempotency** — fire the same Razorpay event twice; assert exactly one set of ledger lines. Fire `captured` before the order row exists; assert it is not dropped.
- **Ledger invariant** — after any sequence of capture/refund/payout operations, total debits equal total credits.
- **Assignment concurrency** — N simultaneous payments against a pool of M professionals with capacity C produces exactly the available capacity in assignments, and every remaining order queued rather than lost.
- **Invoice numbering** — concurrent captures produce a contiguous sequence with no gaps and no duplicates; an aborted transaction burns no number. Include a frozen-clock test at the 31 March IST financial-year boundary.
- **Session revocation** — suspend a user mid-session; the very next request is rejected.
- **Slug parity** — every seeded `(category, slug)` resolves to a live marketing page, and no seeded slug contains `u2013`.

**End to end before calling it done:** run the portal against a Razorpay test account and walk the real path in a browser — marketing CTA → login → checkout → pay → assignment appears in the professional's dashboard → admin sees it. Type checks and unit tests verify correctness, not that the feature works.

---

## Open items

1. **Confirm the Postgres reversal** — revert to MongoDB if it was a client or team mandate rather than a default pick.
2. **Portal framework and realtime approach** are assumed (Next.js App Router, ~15s polling) — confirm or redirect.
3. **§194-O vs §194J** determination needs a practising CA before M2 ships. Build the rate as configuration either way.
4. **GST: principal or agent?** If Lawxygen invoices the client for the full amount and the professional invoices Lawxygen, that is the *principal* treatment. If the professional supplies the client directly and Lawxygen only charges commission, that is the *agent* treatment. Different invoices, different GST liability. Same CA conversation as item 3. The ledger shape supports both, but the invoice renderer is not portable between them — decide before M2, not during. Also unresolved: reverse charge on services from GST-unregistered professionals.
5. **Do consultations need scheduled time slots?** 49 of the 259 services are `talk-*` consultations. As the PRD is written there is **no calendar** — payment assigns a professional who then makes contact, so nothing needs booking. If slots are added later, Postgres handles it natively: `btree_gist` is already installed and the exclusion constraint is already written and proven in `test/integration/schema.test.ts`. No product compromise required, which was not true on Mongo.
6. **Razorpay onboarding** for the business account should start now — approval is a documentation process measured in weeks and is a common cause of launch slippage.
7. **Advocate advertising restrictions** — Indian rules on advocate solicitation are materially stricter than for CAs and CSs. If professional profiles ever become public, this needs written counsel guidance *before* the profile template is designed. Not blocking for v1, which has no public profiles.

---

## Build order within M0

1. Port the foundation files and get `npm run verify` (typecheck → lint → test → build) green against a Neon branch.
2. Express skeleton wrapping the ported `lib/api.ts` error contract; health check; CI.
3. Auth: sessions, then password, then Google OAuth, then OTP. Role guard on every mutation from the first endpoint, not retrofitted.
4. Then M1 onward.
