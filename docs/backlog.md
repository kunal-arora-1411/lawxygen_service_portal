# Lawxygen — outstanding work

Companion to [`delivery-plan.md`](./delivery-plan.md). That document is the plan; this
one is what is actually left, surveyed against the code on 19 September 2026.

**State.** M0–M4 are substantially built: auth, catalogue, checkout, payments, ledger,
invoicing, assignment, payouts, refunds, reconciliation and professional onboarding.
235 backend tests pass. A real Razorpay test-mode payment has been taken end to end —
order `LX-001654`, invoice `LX/2026-27/001191`, ledger balanced, assigned automatically.

**How to read the priorities.** P0 items are ones where a real client or a real
professional hits a wall. P1 is the M4 exit criterion — operations running a week with
no developer. P2 is the wiring hygiene that gets more expensive the longer it waits.
P3 is M5. Nothing here is optional; the ordering is about sequence, not importance.

---

## P0 — a real user hits a wall

### 1. Professional onboarding — **done**

Shipped 19 September 2026. A client applies at `/apply`, fills in registration and
payout details against a readiness checklist, and submits; admin reviews at
`/admin/professionals/:id` and verifies, rejects with a reason, or reinstates.
Bank details are frozen while a payout batch is drafted against them, and neither PAN
nor account number is ever decrypted into a response.

Two things deliberately left:

- [ ] **Credential documents.** No upload — the registration number is checked against
      ICAI's, ICSI's or the Bar Council's public register instead, which is a stronger
      check than a PDF. Revisit with item 4
- [ ] **Changing verified details.** Everything except capacity is frozen once verified
      and has to go through support. A self-service path with re-review is the right
      answer eventually

### 2. Notifications — **mostly done**

Shipped 20 September 2026. Six messages, all outbox subscribers in
`src/modules/notifications/`: payment receipt, assignment notice with the
acknowledgement deadline, matter status changes, refund confirmation, professional
verified, and payout released. The `notifications` table makes delivery exactly-once;
`retryFailedNotifications` re-drives failures every five minutes.

Remaining:

- [ ] **Pick a provider and set `MAIL_PROVIDER_KEY` / `MAIL_FROM`.** The adapter
      targets Resend, which is one POST; any HTTP provider drops in unchanged. Local
      logs the message, anything else refuses to send — so this is a launch blocker,
      not a nicety
- [ ] **Acknowledgement-overdue nudge before escalation.** Needs a new event from the
      escalation sweep; today the professional only hears after the matter is taken
- [ ] **SMS split.** Everything is email. `src/modules/auth/sms.ts` is the pattern, and
      the assignment notice is the obvious first candidate for a text
- [ ] **Attach or link the invoice** on the payment receipt — blocked on item 3

### 3. Invoices are issued but never delivered

`GET /payments/:reference/invoice` works and real invoices exist. Nothing renders one.
There is no `/invoices` page and no PDF. Giving the client their tax invoice is a legal
obligation, not a feature.

- [ ] `/invoices` list in the portal, and a per-invoice view
- [ ] PDF rendering with both GSTINs, place of supply, SAC code, and correct
      CGST+SGST versus IGST
- [ ] Download link on the order, and on the payment receipt email
- [ ] The renderer is **not portable** between the principal and agent GST treatments.
      Do not build it until the determination in item 25 is answered

### 4. Document exchange

No file upload exists anywhere in the system. A client cannot send the professional
their documents; a professional cannot deliver the finished filing. v1 has no in-app
chat by design — contact details accompany the assignment — but "email me the papers"
outside the platform means the matter has no record.

- [ ] Decide whether v1 carries documents at all, or whether they travel out-of-band
      until WhatsApp lands in Phase 2. **This is a product decision, not a technical
      one, and it blocks items 1 and 5**
- [ ] If yes: object storage, signed URLs, virus scanning, retention policy, and an
      access rule tying a document to the matter's two parties

### 5. Missing detail screens

- [ ] Client order detail. `GET /orders/:reference` exists in the API; the portal only
      has the list at `/orders`
- [ ] Professional matter detail. There is no `GET /pro/matters/:id` — only the list,
      acknowledge and status transitions. No internal notes, no document view
- [ ] Client profile and account settings. No endpoint, no page. A client cannot change
      their own name, phone or password

### 6. Password reset — **done**. Email verification — **not started**

Shipped 20 September 2026. `POST /auth/password/forgot` and `/auth/password/reset`,
with `/forgot` and `/reset` in the portal and a link on the sign-in form. Requesting
never reveals whether an address exists (the throttle is silent for the same reason),
the token is stored hashed, using one signs out every session and kills every other
outstanding link, and all failures return one message.

- [ ] **Email verification is still untouched.** `verification_tokens` remains dead
      schema. Needs a decision on what an unverified account may do — recommend browse
      and pay, but not receive payouts
### 7. Money settings are constants

`src/lib/money.ts` hardcodes `commissionBps: 3000`, `gstBps: 1800`, `tdsBps: 10`,
`tdsSection: "194O"`. The plan requires these to be configuration precisely because the
§194-O versus §194J answer is coming from a CA. Payouts do record which section and rate
applied, so history is safe — but changing the rate today is a code deploy.

- [ ] Settings table, seeded from the current constants
- [ ] Admin settings screen: default commission, withholding section and rate, GST rate,
      escalation window
- [ ] Per-professional commission override (the admin feature list promises it)
- [ ] `deriveAmounts` already takes a `MoneySettings` argument — thread the stored
      settings through capture, refund and payout rather than defaulting

---

## P1 — operations cannot run a week unattended

This is M4's exit criterion, and it is not met.

### 8. Impersonation is half-built

The policy refuses `payout.release`, `refund.approve`, `invoice.reissue`,
`user.role.change`, `user.delete` and `reconciliation.run` while impersonating, and
sessions carry `impersonatorId`. **No route ever sets it.** The guard exists; the
capability does not.

- [ ] `POST /admin/users/:id/impersonate`, time-boxed and consent-gated
- [ ] Stop-impersonating, and a persistent banner in the portal while active
- [ ] Every write during impersonation records both identities — `recordAudit` already
      takes the actor, verify it captures the impersonator too

### 9. Client management

- [ ] `GET /admin/users` with search and filter
- [ ] Client detail: account, order history, payments, refunds
- [ ] Suspend and reactivate a client (professional suspension exists; client does not)

### 10. Audit log viewer

The audit log is written to and never read. Searchable, filterable, immutable.

- [ ] `GET /admin/audit` with cursor pagination and filters on actor, action, resource
- [ ] Portal screen

### 11. Analytics

`GET /admin/overview` returns counts. The plan promises revenue and demand by category,
assignment turnaround, professional performance and conversion.

- [ ] Revenue by period, by category
- [ ] Assignment turnaround, and acknowledgement latency
- [ ] Professional performance: matters held, completed, overdue
- [ ] Conversion: orders created versus paid

### 12. Catalogue management gaps

Pricing and active/inactive work. The plan also promises:

- [ ] The *New in Lawxygen* flag, which the client dashboard row needs as a real source
- [ ] The curated *services you might need* pairing map
- [ ] Category management (the 10 categories are seed-only today)

### 13. Finance screens

- [ ] Ledger view, filterable by account and order
- [ ] Payments list with gateway error codes for support
- [ ] Invoice reissue (the policy blocklist already names `invoice.reissue`)
- [ ] Reconciliation exception resolution — today a run records exceptions and nobody
      can mark one handled, so the same three demo rows will repeat forever

### 14. Client-side cancellation and refund requests

Refunds are admin-only. A client has no way to ask.

- [ ] Client cancels an unpaid order
- [ ] Client requests a refund on a paid one; it lands in an admin queue
- [ ] Decide the policy: before assignment, after assignment, after completion

---

## P2 — wiring hygiene, which is the stated priority

### 15. OpenAPI generation

The portal's types in `lib/api.ts` are hand-written mirrors of backend Zod schemas.
This is a known, documented drift risk across two repos: when they disagree it is a
production runtime bug, not a compile error. Every endpoint added before this is fixed
is another type to un-write later.

- [ ] Emit OpenAPI from the Zod schemas, committed to the backend repo
- [ ] CI fails the backend build when the committed spec is stale
- [ ] Generate the portal client from it; delete the hand-written types
- [ ] If the repos ever merge, this collapses into a shared `packages/contract` and
      should

### 16. Continuous integration

There is no `.github/` directory. `npm run verify` exists in both repos and is run by
hand. **I have twice committed with failing checks in this project** because I chained
a `grep` that succeeded while the test run underneath it failed.

- [ ] CI on both repos: typecheck, lint, format, test, build
- [ ] A Postgres service container for the integration suite
- [ ] Branch protection so the gate cannot be walked past

### 17. Deployment

`docker-compose.yml` runs local Postgres. There is nothing else — no Dockerfile, no
deploy configuration, no staging environment. Every milestone's exit criterion in the
plan says "on staging", and there is no staging.

- [ ] Backend container and deploy target
- [ ] Portal deploy, and `app.lawxygen.in` DNS
- [ ] Neon production and staging branches
- [ ] Migration step in the deploy pipeline. **Migration 0006 was missing from the dev
      database and reconciliation 500'd until it was applied by hand** — the test
      harness migrates automatically and nothing else does
- [ ] `FIELD_ENCRYPTION_KEY` is absent from `.env.example` despite being required; the
      example file and the env schema have drifted

### 18. Background jobs will not survive a second instance

`src/jobs/runner.ts` uses in-process `setInterval`. The comment says a separate worker
is the right answer once there is more than one instance, and that the jobs are already
safe to run concurrently because they claim with `FOR UPDATE SKIP LOCKED`. That is true
of the outbox and the drain; **reconciliation has no such claim** and two instances
would run it simultaneously.

- [ ] A lock or a leader election on reconciliation, or move jobs to a single worker
- [ ] Health/liveness signal per job, so a dispatcher that has quietly died is
      distinguishable from a quiet day

### 19. Observability

`SENTRY_DSN` is validated in `lib/env.ts` and used nowhere.

- [ ] Wire error reporting
- [ ] Alert on: reconciliation failing twice consecutively, ledger imbalance non-zero,
      outbox backlog growing, assignment queue depth above a threshold
- [ ] The reconciliation job already logs exceptions at `warn` for exactly this

---

## P3 — M5 hardening

### 20. Security

- [ ] Rate limiting on auth, OTP and password reset, by IP **and** by identifier
- [ ] CSP on the portal. `next.config.ts` sets four basic headers and no CSP; the
      backend has one via Helmet. Razorpay Checkout will need explicit allowances
- [ ] Key rotation for `FIELD_ENCRYPTION_KEY`. Ciphertext is stored `v1:<iv>:<tag>:<ct>`
      so the version prefix is there — the rotation path is not
- [ ] `SESSION_SECRET` rotation, noting it also keys the OTP HMAC in `lib/crypto.ts`
- [ ] Independent penetration test, critical and high findings closed and retested
- [ ] WAF

### 21. Data safety

- [ ] Backups, and a **timed restore drill actually performed** against the stated
      recovery objective
- [ ] Retention and deletion policy, including what "delete my account" means for
      orders, invoices and ledger entries that must legally survive it

### 22. Load

- [ ] Load test, particularly concurrent assignment: the capacity breach found in this
      project was invisible until payments arrived seconds apart

### 23. Legal

- [ ] Terms, privacy policy, refund policy — counsel-reviewed, with per-user acceptance
      recorded
- [ ] Advocate advertising restrictions before any professional profile becomes public.
      Indian rules on advocate solicitation are materially stricter than for CAs and
      CSs. Not blocking for v1, which has no public profiles

---

## Known defects and debt

### 24. Open issues

- [ ] **Intermittent outbox flake.** An "outbox event errored" assertion fires roughly
      1 run in 15; not reproduced in the last several dozen. Hypothesis is a deadlock
      between concurrent assignment transactions, which the outbox would retry in
      production. The assertion now prints the stored error so the next occurrence
      self-diagnoses. Do not close this until it has been seen and explained
- [ ] **Three fabricated demo payments** in the dev database report as
      `unknown_to_gateway` on every reconciliation run, forever. Either delete them or
      build exception resolution (item 13)
- [ ] **Tests share one database.** Suites write global state — `update professionals
      set available = false` — and one reconciliation assertion had to be scoped around
      it. This has caused three separate rounds of pollution bugs already
- [ ] **`RAZORPAY_WEBHOOK_SECRET` is a placeholder locally.** Razorpay cannot reach
      localhost, so confirm and reconciliation carry the load here. The real secret
      must be set wherever webhooks can actually arrive, because there the webhook goes
      back to being the source of truth

### 25. Decisions that are still assertions in issued invoices

Both need a practising CA, and both are already being asserted on documents that have
been issued.

- [ ] **§194-O versus §194J.** Currently 0.1% as an e-commerce operator. If Lawxygen is
      not an e-commerce operator for this arrangement, it is 10% on professional fees —
      a hundredfold difference in what is withheld
- [ ] **GST: principal or agent?** Currently invoicing the client for the full amount,
      which is the principal treatment. The ledger shape supports both; the invoice
      renderer does not. **Decide before building item 3**
- [ ] Reverse charge on services from GST-unregistered professionals

---

## Non-code blockers

- [ ] **Razorpay production account.** Test keys work today. Live onboarding is a
      documentation process measured in weeks and is a common cause of launch slippage
- [ ] **RazorpayX for payouts.** Needs a business account that does not exist. Releases
      are simulated locally and refuse outright in any other environment
- [ ] **Real prices.** 259 services, all unpriced except those set for testing
- [ ] **Professional recruitment.** A marketplace with no supply is deployed, not
      launched. The plan calls for a seeded cohort per priority category
- [ ] **Marketing site CTAs.** `lawxygen.in`'s 259 pages still dead-end; they need to
      point at `app.lawxygen.in/checkout?category=…&service=…`. Note that both
      parameters are required — 22 slugs exist in two categories at once

---

## Explicitly deferred to Phase 2

Not forgotten, deliberately out of scope. The seams are built: the outbox takes a new
subscriber without touching emitting code, E.164 phone and messaging consent are
captured at registration, and the order has somewhere for a conversation to attach.

- WhatsApp bot contacting the client after payment
- Connecting the professional into the same thread
- Consultation time slots. 49 of the 259 services are `talk-*` consultations and the
  PRD has no calendar. If slots are added, `btree_gist` is installed and the overlap
  exclusion constraint is already written and proven in `test/integration/schema.test.ts`
