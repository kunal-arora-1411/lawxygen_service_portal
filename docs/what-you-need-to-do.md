# What Lawxygen needs from you

A plain-English list of everything the build is waiting on from your side. No code in
here. Companion to [`backlog.md`](./backlog.md), which is the engineering task list.

Last updated 21 September 2026.

---

## The short version

The software is largely built. What is left is mostly paperwork, accounts, and a handful
of decisions — very little of it is code.

Three things genuinely block launch. **You cannot take real money yet**, because the
Razorpay production account does not exist. **You cannot pay professionals at all**,
because that is a separate account that also does not exist. And **nothing the system
sends actually leaves the building**, because no email provider is connected.

Everything else on this list is either quick, or can run quietly in the background while
I keep building.

The cheapest item by a wide margin is the email provider: about ten minutes of signup,
and it turns two finished features — payment receipts and professional notifications —
from switched off into working. If you do only one thing after reading this, do that one.

---

## Do these this week

Three small things. Together maybe an hour of your time, and they unblock more than
anything else on this list.

### 1. Sign up for an email provider — 10 minutes

**What it is:** an account with a service that actually delivers email. I have built the
system to use Resend, which is the simplest, but any of them work — swapping is a
one-line change.

**Why it matters:** right now, when a client pays, no receipt goes out. When a
professional is assigned a matter, nobody tells them. When someone forgets their
password, no reset link arrives. All three features are finished and tested — they are
simply switched off until this account exists.

**What I need from you:** the API key, and the "from" address you want clients to see
(something like `no-reply@lawxygen.in`).

### 2. Make the business name consistent everywhere — 20 minutes

**What it is:** the name on your website, your Facebook page, and the documents you will
give Meta all need to be the same business.

**Why it matters:** a mismatch is one of the commonest reasons Meta rejects a
verification, and it costs nothing to fix beforehand. It is much harder to fix after a
rejection.

### 3. Start Meta business verification — 30 minutes to submit

**What it is:** proving to Meta that your business is real, by uploading two documents.

**Why it matters:** it raises your WhatsApp sending limits. You do **not** need it to
start sending — see the next section — so submit it and forget about it while it
processes.

**How long:** usually one to three working days. Longer only if a document has to be
redone, which is why scan quality matters.

**What to upload.** Two documents, from: Certificate of Incorporation, GST certificate,
business PAN, business bank statement, Shop & Establishment certificate, Udyog Aadhaar,
business licence, utility bill. One should prove the **legal name** (Incorporation
certificate or GST certificate are strongest), one should prove the **address**
(utility bill or bank statement, dated within 90 days). Scan full pages, all four
corners visible. Cropped or blurry uploads are the commonest avoidable rejection.

**Where:** Meta Business Suite → Business settings → Security Centre → Start
verification.

---

## WhatsApp messaging

You already own the hard part — PingMe does all the WhatsApp plumbing, and the phone
number is bought. What is left is short.

### You can start sending before verification

This changes the order of everything. An **unverified** business can already send to
**250 different people every 24 hours**, using up to 2 phone numbers. Verification does
not grant access — it raises the ceiling to 2,000+ a day.

250 conversations a day is far more than Lawxygen needs at launch. There is no reason
to wait.

### What still needs doing

**Link the number.** In PingMe, assign the Plivo number to Lawxygen and set a forwarding
number — your own mobile is fine. Meta rings the Plivo number to read out a verification
code, and the forwarding is how a human actually hears it. The number must support voice
calls for this to work.

**Get two message templates approved.** Any message you send *first* — before the client
has written to you — has to be pre-approved wording. You need two to start: a payment
receipt, and a "your professional has been assigned" notice. Approval usually takes
minutes to a day. I will write them; you submit them through PingMe.

**Add a payment method.** Meta bills per message. Small at your volume, but sends fail
without a card on file.

### One thing to be aware of

Once this number is verified against the business API it can **never** be used in the
normal WhatsApp app again. Make sure it is not a number anyone relies on personally.

### What you do *not* need

The blue tick. It looks good and unlocks group chats, but it is irrelevant to sending,
and realistically months away — it requires independent press coverage and a history of
real message volume, neither of which exists yet. Do not let it sit on the critical path.

---

## Taking real payments

**What it is:** a Razorpay production account, as opposed to the test account we use now.

**Where things stand:** payments work completely. I have put a real card payment through
end to end — order LX-001654, ₹12,999, a proper GST invoice issued, the accounting
balanced to the paisa, and a professional assigned automatically with nobody touching
it. All of that in Razorpay's test mode, which behaves identically but moves no money.

**Why this is the long pole:** production approval is a documentation review by Razorpay,
and it is the classic reason launches slip. Not difficult — just not fast, and it cannot
be rushed at the end.

**What they will want:** business registration documents, PAN, GST certificate, a bank
account in the business name, and your website carrying visible terms, privacy policy,
refund policy and contact details. That last part matters — a site missing policy pages
is a common cause of delay, and Lawxygen does not have them yet. They also need a
lawyer's eye, which is its own item.

**What happens without it:** nothing. No client can pay you real money.

**Start this now**, before everything else is ready. The clock runs whether or not
anyone is watching it.

---

## Paying the professionals

**What it is:** RazorpayX. A different product from the Razorpay above, with its own
application. Razorpay collects money *from* clients; RazorpayX sends money *to* people.

**Why it is separate:** money in and money out are regulated differently. Two accounts,
two approvals.

**Where things stand:** the payout machinery is built and tested — it works out who is
owed what from the accounting records, deducts commission and tax, batches it up, and
waits for an admin to press release. Locally it simulates sending. Anywhere else it
deliberately **refuses**, rather than marking people as paid when no money has moved.
That refusal is intentional: a payout system that quietly pretends is far worse than one
that stops.

**What happens without it:** professionals can sign up, be verified, take on work and
accumulate a balance — and cannot be paid a rupee. Not a state you want to be in with
real people doing real work, so apply well before your first professional finishes their
first matter.

One note: Razorpay's other product, **Route**, would split each payment automatically
instead of batching. It needs proof of ₹40 lakh+ turnover under the 2025 RBI rules, so
it is not available to you yet. The system was built so switching later needs no rework.

---

## Questions for your accountant

Two tax questions I cannot answer, and both are **already being asserted on invoices
that have gone out**. They need a practising CA, not a guess. You can send the questions
below almost verbatim.

### Question 1: which section do we withhold tax under?

When you pay a professional you hold back a slice and send it to the tax department. The
question is which rule applies.

- **Section 194-O** treats Lawxygen as an e-commerce operator: withhold **0.1%**
- **Section 194J** treats it as professional fees: withhold **10%**

A hundredfold difference. We currently withhold 0.1%. If that is wrong, you have been
under-withholding on every payout, and the liability is yours, not the professional's.

> *The question to ask:* "We run a marketplace where clients pay us for legal and
> accounting services, and we pay independent CAs and CSs out of that. Are we an
> e-commerce operator under 194-O at 0.1%, or is this 194J professional fees at 10%?"

### Question 2: are we the principal or the agent for GST?

- **Principal** — Lawxygen sells the service to the client and the professional bills
  Lawxygen. You invoice the full amount. This is what we do today.
- **Agent** — the professional sells to the client and Lawxygen charges only a
  commission. You would invoice only your fee.

Different invoices, different GST liability, different numbers on every document.

> *The question to ask:* "Clients pay us the full price for a service delivered by an
> independent professional we assign. For GST, are we supplying the service as
> principal, or acting as an agent and supplying only a commission?"

While they are answering, also ask about **reverse charge** — what happens when a
professional is not GST-registered.

### Why this blocks something

Giving clients their tax invoice is a legal obligation, and the invoice looks genuinely
different under the two answers. I have deliberately not built the invoice page or PDF
yet, because it is not portable between them and I would be building it twice.

The tax *rate* is less urgent — I can make it a setting you change from a screen,
without a developer. That is on my list regardless.

---

## Information only you have

### Prices for 259 services

Every service in the catalogue is unpriced and switched off, except a handful I priced
arbitrarily for testing. A service with no price cannot be bought.

You do not need all 259 to launch. Pick the 15 or 20 you actually want to sell first,
price those, and leave the rest hidden — pricing is a screen in the admin console, so
you can add more whenever you like without anyone touching code.

Two things worth knowing while you set them:

- Prices are **GST-inclusive**. What you type is what the client pays; the tax is broken
  out on the invoice.
- 22 service names appear in two categories at once — always a filing that also exists
  as a consultation. Those are genuinely different products and need **different
  prices**. The admin screen keeps them apart.

### Which legal entity is this?

Your email is on `techcurators.in` and the code lives under a TechCurators GitHub
account. So: is Lawxygen its own registered company, or a brand of TechCurators?

It does not matter which — but it has to be decided before you verify with Meta or apply
to Razorpay, because the documents must match the name you type in exactly, down to
"Private Limited" versus "Pvt Ltd".

### Your first professionals

A marketplace with nobody on the supply side is deployed, not launched. Onboarding is
now built — a CA applies at `/apply`, enters their ICAI number and bank details, and you
approve them from the admin console. Nothing in that flow needs a developer.

What it needs is people. Recruiting even five verified professionals across your main
categories takes longer than any software task on this list, so start before you feel
ready.

---

## Decisions I am waiting on

### Does version 1 carry documents?

Today a client cannot send their professional a document, and the professional cannot
deliver the finished filing. There is no file upload anywhere in the system.

Either we build it — storage, secure links, virus scanning, a retention policy — or
documents travel by email and WhatsApp outside the platform until later.

*My recommendation:* leave it out of v1. Contact details already accompany every
assignment, so the two of them can exchange files directly, and WhatsApp will carry it
properly in Phase 2. Building half a document system is worse than not having one.

This one genuinely blocks me, because it changes the shape of the professional's
matter screen.

### What can an unverified email account do?

Right now anyone can register with any email address and immediately buy something.

*My recommendation:* let them browse and pay without verifying, but require a verified
address before they can receive payouts as a professional. The payout side is where a
wrong address actually costs money; making a paying client verify first just loses sales.

### Where does this get hosted?

The database is decided (Neon). The application hosting is not, and there is no staging
environment — every milestone in the plan says "demonstrate it on staging", and there is
nowhere to demonstrate it.

I need a target to point at. Any of the usual ones are fine; I mainly need to know which.

---

## Suggested order

**This week**

- Email provider signup — 10 minutes, unblocks two finished features
- Submit the Razorpay production application — the longest clock, start it first
- Submit the RazorpayX application
- Start Meta business verification
- Decide the legal entity name, and make it consistent across site and Facebook page

**Next week or so**

- Brief your CA on the two tax questions
- Link the Plivo number in PingMe and submit the first two templates
- Answer the three decisions above
- Price your first 15–20 services

**Running in the background, start now**

- Recruit your first professionals — the slowest item on the list
- Get terms, privacy and refund policies drafted and reviewed — Razorpay will ask
- If you want the blue tick eventually, start earning press coverage now; it needs three
  editorial articles in a six-month window

**Not urgent, but do not forget**

- The marketing site's 259 service pages still lead nowhere. They need to point at the
  new checkout. That is the entire top of the funnel, and it is currently disconnected.
