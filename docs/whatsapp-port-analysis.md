# Porting WhatsApp from PingMe into Lawxygen

Analysis, 21 September 2026. Written after reading the PingMe source at
`E:\lawxygen\whatsapp\Campaign-Backend` and `Campaign-Frontend`.

**The brief:** take features from PingMe's code into Lawxygen. **PingMe is not used at
all** — not as a service, not as a console, not for authoring. It was built for a
client; only the code is reusable. Every WhatsApp operation happens in Lawxygen,
against Lawxygen's own WhatsApp Business Account. Specifically — chat in the professional dashboard, conversation assignment and
chat visibility in admin, template management in admin, and the ability to fire a
template from either dashboard.

---

## What PingMe actually is, under the hood

Worth knowing before deciding what to copy.

- **Express + TypeScript**, same as Lawxygen. Route/service/repository layering.
- **MongoDB**, via a hand-rolled shim at `src/config/prisma.ts` that is *named* `prisma`
  but is not Prisma. Call sites read like Prisma (`findFirst`, `create`, `update`,
  `$transaction`), which flatters the port — the shape translates to Drizzle, but every
  line of data access is a rewrite.
- **Redis + BullMQ** for queues, **Socket.io** for realtime.
- **Multi-tenant throughout.** `org_id` is on every document and every query. Lawxygen
  is a single organisation, so a large share of PingMe's complexity is not needed.

It is good code. The webhook handling, the idempotent send machinery and the Meta error
classification are the parts worth having, and they were clearly paid for in production.

---

## What you asked for, mapped to their files

| What you want | PingMe backend | PingMe frontend |
|---|---|---|
| Chat in professional dashboard | `routes/chat.route.ts` (1,086 lines, 12 endpoints), `services/whatsappInbound.service.ts`, `services/messageAudit.service.ts`, `lib/socket.ts` | `app/inbox/page.tsx` (1,674 lines) |
| Assign a team member | `PATCH /conversations/:id` with `assign` / `transfer` / `takeover` / `resolve` / `reopen`, plus `handoff_tickets` | inside the same inbox page |
| Admin sees the chat | same endpoints, no extra work | same page |
| Templates in admin | `services/template.service.ts`, `services/metaTemplate.service.ts`, `lib/templateValidator.ts` | `TemplateBuilderForm.tsx` (738), `TemplateList.tsx` (606) |
| Fire a template from a dashboard | `services/directSend.service.ts` | `DirectSendModal.tsx` (756) |

Everything you asked for exists. None of it is speculative.

---

## What ports cleanly, and what does not

### Copy almost unchanged — about 800 lines of real value

These are pure functions or thin HTTP wrappers with no database in them:

| File | Lines | What it is |
|---|---|---|
| `lib/graph.ts` | 80 | Meta Graph wrapper. Handles the trap that Meta signals throttling by error *code* (130429) inside an HTTP 400, so status alone cannot tell a retryable throttle from a permanent rejection |
| `lib/metaErrorCatalog.ts` | 383 | Classifies every Meta error into retryable / cooldown / fatal, with scope. Hard-won, and the thing you would most regret rewriting |
| `services/templateRendering.service.ts` | 82 | Turns a template definition plus sent variables into displayable text. Handles named *and* positional `{{1}}` parameters |
| `lib/templateValidator.ts` | 133 | Validates a template before submitting it to Meta |
| `services/meta.service.ts` | 91 | Webhook signature verification, template send, template sync |
| `classifyReplyIntent` | ~15 | Detects "stop", "interested", "call me" from an inbound message |

This is the highest-value, lowest-risk part of the port. Take it as-is.

### Logic ports, code does not

The *rules* are correct and worth copying; the implementation is Mongo-shaped.

**The send-attempt state machine** (`messageAudit.service.ts`, ~150 lines). This is the
best thing in their codebase. It reserves an attempt row by idempotency key, claims
ownership with a token, stamps `biz_opaque_callback_data` so Meta's status webhook can
be correlated back, and distinguishes four outcomes: accepted, deduplicated,
`failed_retryable`, and `delivery_unknown`.

That last one matters. If the connection drops *after* sending, Meta may already have
accepted the message — so it is never auto-resent. Lawxygen already reasons this way
about Razorpay, so the idea will feel familiar. The Mongo `findOneAndUpdate` upsert
becomes `INSERT … ON CONFLICT`, which Lawxygen already uses for webhook dedupe.

**Inbound persistence** (`whatsappInbound.service.ts`, 221 lines). Finds or creates the
contact, finds or creates the conversation, writes the message, bumps unread, records an
opt-out if the text is "stop". All inside one transaction, and deliberately independent
of the automation worker so a restarting worker can never make a customer message
vanish. Straight translation to a Drizzle transaction.

**The chat endpoints.** Twelve of them, but perhaps half the code is multi-tenancy and
number-access checks you do not need.

### Do not port

- **Multi-tenancy.** `org_id` everywhere. Lawxygen is one organisation.
- **The AI agent layer.** Mistral, Atlas Vector Search, knowledge ingestion, confidence
  gating. Excellent, and a completely different project. It also requires MongoDB Atlas
  specifically, for vector search.
- **Campaigns, sequences, segments, the flow engine, voice, billing, the admin console.**
  Not your problem.
- **BullMQ and Redis.** See below — this is the important one.

---

## The four decisions that matter

### 1. Do not add MongoDB and Redis to Lawxygen

PingMe needs both. Lawxygen has neither, and adding two datastores to get a chat feature
would be a serious regression in a system whose whole argument for Postgres was that
money needs transactions and constraints.

You do not need them:

- **Queues.** Lawxygen already has an outbox with `FOR UPDATE SKIP LOCKED`, retries,
  backoff and a dispatcher. It does what BullMQ does here, on the database you already
  run. Inbound WhatsApp webhooks become outbox events.
- **Realtime.** PingMe uses Socket.io. Lawxygen's plan already settled on ~15 second
  polling, and for a professional watching one or two matters that is honestly fine.
  Sockets can be added later on the same seam.
- **Throttle cooldowns.** PingMe keeps these in Redis. A small Postgres table with an
  expiry does the same job at your volume.

### 2. Conversations key on (number, client) — **decided**

PingMe already keys a conversation on `(org_id, phone_number_id, contact_id)` — the
number *and* the contact, not the contact alone. Adopt that key.

It matters because of where this is going. Today there is one number, so one client has
one thread. The agreed plan is a **pool of five or six numbers**, with a number allocated
when a client enrols in a service, so each matter gets its own thread and its own
professional. Keying on the number from day one means that future needs **no migration** —
the same schema serves one number and twenty.

It also dissolves the problem that made this a hard question. With a number per matter,
two professionals never share a thread, so there is no need to hide part of a
conversation from one of them.

Until the pool exists, with a single number, a client with two matters does share one
thread. For that interim: **each professional sees only from their assignment onwards,
admin sees everything.**

What the pool brings with it, to plan for:

- **Business verification is a prerequisite.** Unverified allows **2** phone numbers;
  verified allows 20. Five or six needs the verification through.
- **Each number needs its own Meta registration and display name approval**, and carries
  its own Plivo rental.
- **An allocation rule is needed.** Allocate a number per *active* matter and release it
  when the matter closes. If a client has more active matters than there are numbers, two
  matters land on one number — fall back to the least recently used, and accept the
  shared thread for that case with the assignment-window rule above.
- **The client sees several Lawxygen numbers.** Normal enough — delivery and fintech apps
  do it — but each display name should make the association obvious.

### 3. The 24-hour window shapes the whole UI

A professional can only type freely for **24 hours after the client's last message**.
Outside that window, only a pre-approved template can be sent. PingMe enforces this and
returns `REPLY_WINDOW_CLOSED`.

So the professional's chat box cannot be a plain text input. It has to show the window
state, count down, and swap to a template picker when the window closes. That is a UI
requirement, not a nicety — otherwise every professional's first out-of-window message
fails and they conclude the product is broken.

### 4. The cost model, and the part that catches people

Rates, per **message**, not per day:

- **Utility / authentication templates: ₹0.115**
- **Marketing templates: ₹0.8631** — 7.5× more
- **From 1 October 2026**, free-form messages sent *inside* the 24-hour window also cost
  about ₹0.115. They used to be free.

Two rules decide what you actually pay, and the first one surprises people:

**A template does not open the window.** The 24-hour window opens only when the **client
replies**. Send a receipt and get no answer, and the professional cannot free-text at
all — every further outreach must be another template.

**Inside the window, replies are now billed.** Before 1 October a ten-message support
exchange was free. After it, that is ten charges.

A typical matter therefore looks like:

```
template out                ₹0.115    window still closed
client replies              free      window opens, 24h
professional replies × 10   ₹1.15     from 1 Oct; was free
24h of silence                        window closes
template out again          ₹0.115
```

**Keep this in proportion.** A chatty matter of 30 messages costs roughly ₹3.45. Against
a ₹12,999 order that is 0.03%. Not free, but not remotely a reason to avoid chat — it is
a reason not to build anything that sends on a loop.

**Every template must be written in the utility category.** A template phrased like
marketing copy gets categorised as marketing by Meta and costs 7.5× for its whole life.

## Suggested build order

Each phase is useful on its own and does not need the next one.

### Phase A — outbound only

No inbox, no inbound webhook, no chat UI.

- Port `lib/graph.ts`, `meta.service.ts`, `metaErrorCatalog.ts`, `templateValidator.ts`
- A `whatsapp_send_attempts` table and the idempotent send state machine on Postgres
- Two templates: payment receipt, assignment notice
- Wire them as **outbox subscribers**, exactly like the email subscribers already there
- A "send template" action on the admin order screen

At the end of this, clients get WhatsApp receipts and professionals get WhatsApp
assignment notices. That alone delivers most of the original Phase 2 promise.

### Phase B — inbound and the thread

- Webhook endpoint with signature verification, writing into the outbox
- `contacts`, `conversations`, `inbound_messages`, `outbound_messages`,
  `message_status_events`
- Port the inbound persistence logic
- Read-only thread view on the admin order screen

### Phase C — the professional chat

- The send endpoint with the 24-hour window rule
- Chat UI in the professional dashboard, window-aware
- Template picker for when the window is closed
- Polling to start with

### Phase D — assignment and handoff

- `assigned_agent_id` on the conversation, `handoff_tickets`
- Admin assign / transfer / takeover / resolve
- Professional sees only their assigned window

### Phase E — template management in admin

- Template CRUD, submission to Meta, approval-status sync
- Port `TemplateBuilderForm` and `TemplateList` as the starting point

**Phase E moved into Phase A.** The original note here suggested authoring templates in
PingMe's console as an interim. That is not available — Lawxygen authors its own,
validates them locally and submits them to Meta itself.

---

## Honest assessment of effort

The reusable pure code is perhaps a day. The send machinery on Postgres, with tests to
the standard the payment code is held to, is several days. Phases B through D are each
roughly a week including UI. Phase E is a week.

**The largest risk is not the code.** It is that Lawxygen would then run a second
WhatsApp integration alongside PingMe's, against the same Meta platform, and both need
maintaining as Meta changes. PingMe has 265 commits of accumulated fixes for exactly
that. Worth going in with that open-eyed — you rejected the service-integration path
deliberately, and this is what it costs.

One thing that lowers the risk: **use a different phone number for Lawxygen than
PingMe's tenants use.** Two systems writing to one thread would be a genuine mess.

---

## Decisions taken

- **Postgres only.** No MongoDB, no Redis. Queueing rides the existing outbox.
- **Conversations key on (number, client)**, ready for the number pool.
- **A pool of 5–6 numbers**, a number per active matter, once verification allows it.
- **PingMe's code, never PingMe itself.** It was built for a client. Not its service,
  not its console, not its account — nothing operational runs through it. This closes
  off the FireReach-integration option rather than leaving it open, and it moved
  template authoring from Phase E into Phase A, since there is no other console.

## Still open

1. **The template wording.** Two are needed to switch Phase A on: a payment receipt and
   an assignment notice. Both must read as unambiguously transactional to stay in the
   ₹0.115 utility band rather than the ₹0.86 marketing one, and Meta's classification is
   permanent for the life of the template.
2. **The WhatsApp credentials**, once the number is linked — phone number id, WABA id
   and access token.
