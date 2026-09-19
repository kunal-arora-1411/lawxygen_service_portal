# lawxygen_service_portal

The client portal at `app.lawxygen.in`. Next.js App Router.

`lawxygen.in` stays a static marketing site and keeps the organic search value; this is
the transaction surface it hands off to. The API lives in `lawxygen_service_portal_backend`.

- PRD: `context.txt`
- Delivery plan: `docs/delivery-plan.md`

## Getting started

The API must be running first — this app has no database of its own.

```bash
cd ../lawxygen_service_portal_backend && docker compose up -d && npm run dev   # :4000
cd ../lawxygen_service_portal && npm install && cp .env.example .env.local && npm run dev  # :3000
```

Nothing is buyable until an administrator prices some services: every one of the 259
seeds inactive, and the database refuses to publish a service without a price.

## What exists

| Route        |                                                          |
| ------------ | -------------------------------------------------------- |
| `/login`     | Sign in, register, Google.                               |
| `/dashboard` | Greeting, previously used, new in Lawxygen, suggestions. |
| `/services`  | Full catalogue with search and category filter.          |
| `/checkout`  | One service, or an unpaid order resumed.                 |
| `/orders`    | Every order with its client-facing status.               |

Not built yet: invoices and profile. They are deliberately absent from the navigation
rather than linked to a 404.

## How it talks to the API

**`lib/api.ts` is the only place.** One envelope — `{ ok: true, data }` or
`{ ok: false, code, message, fieldErrors? }` — and the portal switches on `code`, never
on message text or HTTP status.

> **Known gap.** Those types are hand-written to mirror the backend's Zod schemas, so
> nothing structurally stops them drifting, and drift shows up as a runtime bug rather
> than a compile error. The fix is the one in the delivery plan: emit an OpenAPI
> document from those schemas and generate the client. Worth doing before real traffic.

**The session is an httpOnly cookie the API sets**, on a sibling host. Two consequences
that are easy to get wrong:

- Server components must forward the incoming `Cookie` header explicitly — `fetch` on
  the server has no cookie jar. Missing it renders every page as though nobody is
  signed in, which looks like a login bug rather than a missing header.
- Browser calls need `credentials: "include"`, or they are anonymous.

`app/(app)/layout.tsx` redirects anyone without a session. That is a convenience, not
the boundary: the API re-checks authorization inside every handler.

## Conventions

**Checkout links carry both category and slug.** 259 services produce only 237 distinct
slugs — 22 appear in two categories at once, always a filing that also exists as a
`talk-*` consultation. `gst-audit-support` is both, at different prices. A link with the
slug alone is ambiguous about which product is being bought.

**The client sees labels, not statuses.** `ORDER_LABELS` in `lib/api.ts` maps
`payment_failed` to "Payment pending" — support needs the distinction, the client needs
a retry — and maps every unstaffed state to "Matching you with a professional". The
platform's internal difficulty finding someone is not the client's to interpret.

**Money is formatted, never computed.** `formatPrice` takes integer paise from the API.
No arithmetic on money happens in this app.

**Browser state uses `useSyncExternalStore`, not an effect.** Reading `localStorage` or
a media query with `useState` plus an effect renders once with a value known to be wrong
and then again — React 19's lint rules reject it. See `lib/client-state.ts`.

**The auto-rotating row is held to WCAG 2.2.2.** It pauses on hover, pauses on keyboard
focus anywhere inside, has an explicit pause control, and does not start at all under
`prefers-reduced-motion`. An un-pausable moving element fails the standard outright.

**ESLint uses the flat configs `eslint-config-next` exports directly.** Routing them
through `FlatCompat`, which most guides still show, crashes with a circular-structure
error on v16.

## Admin console

`/admin`, gated on the `admin` role. Its own dark shell, deliberately: someone with an
admin role can see both surfaces, and "which side am I on" should never be a question
when the actions change other people's money.

| Route                  |                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------- |
| `/admin`               | Overview, and the banner naming whatever is currently blocking the marketplace. |
| `/admin/services`      | Price, publish, feature. Defaults to the unpriced rows.                         |
| `/admin/professionals` | Verify, suspend, and why someone is not receiving work.                         |
| `/admin/orders`        | Internal status, with reassignment.                                             |

**Prices are typed in whole rupees and sent as integer paise.** `rupeesToPaise` converts
against a digits-only string. A decimal input would put a float between the operator and
the ledger, and money that has been through a float can be a paisa out.

**Saving and publishing are separate actions.** Setting a price should not silently put
something on sale.

**The overview names the current blocker rather than only reporting numbers.** Nothing
priced and nobody available are the two states that stop the platform working at all,
and each has a link to where it is fixed. They advance: pricing the first service
replaces "Nothing is on sale" with "No professional is available".

**Admin sees internal statuses, the client sees labels.** `awaiting_assignment` and
`assignment_escalated` both read as "Matching you with a professional" to a client and
mean different things to operations.

**The eligibility column restates exactly what the assignment engine checks** — verified,
available, has a payout identity, has categories — so "why is this person getting no
work" is answerable without reading the engine.
