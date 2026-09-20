@AGENTS.md

# Lawxygen — portal

Read this before touching anything, along with the two documents in `docs/`:

- `docs/delivery-plan.md` — the agreed plan, milestones M0–M5, locked decisions
- `docs/backlog.md` — **the task list.** 25 numbered items, priority-ordered, current

The API repo (`../lawxygen_service_portal_backend/CLAUDE.md`) carries the fuller
picture: domain rules, tax position, and the list of mistakes already made. Read it too
if the work touches anything the API owns.

---

## What this is

An Indian legal / CA / CS services marketplace. Three repos:

| Repo                              | Deploys to        | What it is                                                       |
| --------------------------------- | ----------------- | ---------------------------------------------------------------- |
| `LAWXYGEN_AGAIN_NEW_UI`           | `lawxygen.in`     | Static marketing site, 259 service pages. **Not being migrated** |
| `lawxygen_service_portal`         | `app.lawxygen.in` | This repo. Next.js 16 App Router                                 |
| `lawxygen_service_portal_backend` | `api.lawxygen.in` | Express 5 + Drizzle + PostgreSQL                                 |

A client pays for a service and a qualified professional is assigned automatically
within seconds, with nobody at Lawxygen touching it.

---

## The rule that matters most

**The portal never touches the database.** It has no connection string and no ORM.
Every read and write goes through the API, which is what keeps authorization in one
place and lets the two deploy independently.

`lib/api.ts` is the only place the portal talks to the API. Everything else imports
from it.

---

## Three surfaces, three identities

| Route                                                       | Who          | Colour     | Shell                       |
| ----------------------------------------------------------- | ------------ | ---------- | --------------------------- |
| `/dashboard`, `/services`, `/checkout`, `/orders`, `/apply` | Client       | light blue | `components/Shell.tsx`      |
| `/pro/*`                                                    | Professional | teal       | `app/pro/layout.tsx`        |
| `/admin/*`                                                  | Operations   | dark       | `components/AdminShell.tsx` |

Somebody can hold more than one role, so "which side am I on" must never be a question
— the actions on the admin side change other people's money.

**`/apply` is deliberately in the client shell, not under `/pro`.** The `/pro` layout
redirects clients away, and until somebody has applied a client is exactly what they
are. Everything after applying sits under `/pro`, by which point the role exists.

---

## Conventions

- **Server components fetch; client components act.** Pages are `async` server
  components using `api.call()` with `forwardedCookie()`. Mutations live in small
  `"use client"` components that `fetch` the API directly with `credentials: "include"`
  and then `router.refresh()`.
- **`lib/session.ts` exists because server `fetch` has no cookie jar.** Always pass
  `forwardedCookie()` from a server component.
- **Switch on `result.code`, never on message text.** The API owns the wording; the
  form owns where it appears. `fieldErrors` maps to fields.
- **Never `Date.now()` during render** — React 19's lint rejects it and it can disagree
  between the server render and a later client one. Anything time-dependent is decided
  in SQL by the API (see `acknowledgeOverdue`).
- **`lib/client-state.ts` uses `useSyncExternalStore`** for localStorage and media
  queries. React 19 rejects setState-in-effect for this.
- **A nav that links to a 404 is worse than a short nav.** Screens are only added to
  navigation once they exist.
- **Money arrives as integer paise.** Use `formatPrice()`. Converting rupees to paise
  for input happens on a digits-only string, never via float arithmetic.
- **Auto-rotating anything must pause on hover and focus and respect
  `prefers-reduced-motion`** (WCAG 2.2.2). See `components/FeaturedRow.tsx`.

---

## Known gaps in this repo

The full list is `docs/backlog.md`. The ones that bite here:

- **Types in `lib/api.ts` are hand-written mirrors of the backend's Zod schemas.** This
  is the known drift risk across two repos — when they disagree it is a production
  runtime bug, not a compile error. Backlog item 15 replaces them with a client
  generated from a committed OpenAPI document, and every endpoint added before then is
  another type to un-write later.
- **No invoices page and no PDF**, though invoices are issued and the endpoint exists.
  Blocked on the GST principal-vs-agent determination, because the renderer is not
  portable between the two treatments.
- **No client order detail page** — only the list. `GET /orders/:reference` exists.
- **No client profile or account settings.** No endpoint either.
- **No CSP.** `next.config.ts` sets four basic headers and nothing else. Razorpay
  Checkout will need explicit allowances when one is added.

---

## Mistakes already made here

- **Conditional render is not a privacy boundary.** The professional's matter card hid
  client contact details until the matter was acknowledged — but a server component's
  props are serialised into the HTML, so they shipped anyway. The fix was to follow the
  PRD (contact accompanies assignment) and drop the condition.
- **`finally` runs in the same tick**, so it reads stale state. `PayButton` tracks
  whether the Razorpay widget opened with a local variable, not `useState`, or the
  button re-enables behind the open modal and a second press creates a second gateway
  order.
- **An always-on action button that the API will reject is worse than no button.** The
  admin "Verify" control used to show for any non-verified professional; the API now
  refuses anything not actually submitted, so the control is status-specific and a
  draft reads "with the applicant".

---

## Running it

```bash
npm install
npm run dev       # :3000 — the API must be running on :4000
npm run verify    # typecheck, lint, format
npm run build     # verify does NOT build; run this before trusting a release
```

`.env.local` is gitignored and does not travel between devices. It needs
`NEXT_PUBLIC_API_ORIGIN=http://localhost:4000` (see `.env.example`).

There is no committed demo-data script, so a fresh database has no accounts. Register
through the portal and promote the user with SQL — see the API repo's `CLAUDE.md`.
