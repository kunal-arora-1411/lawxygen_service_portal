# User Profile — Schema & API Requirements

The client Profile page (`/dashboard/profile`) is now fully data-driven off `GET /api/client/users/me`. This document lists the fields it reads and writes so they can be added to the `User` Mongoose schema.

**Nothing here is breaking.** Every new field is optional, so the page already works against the current backend — it just shows a low completion score and empty inputs until these fields exist.

---

## 1. Fields to add to the `User` schema

Existing fields the page already uses (no change needed): `_id`, `name`, `email`, `phone`, `profileImage`, `role`, `isVerified`, `isActive`, `createdAt`, `updatedAt`.

### New top-level fields

| Field | Type | Notes |
|---|---|---|
| `dateOfBirth` | `Date` | Sent from the frontend as `"YYYY-MM-DD"`. |
| `gender` | `String` | One of: `male`, `female`, `other`, `undisclosed`. |

### New nested objects

```js
address: {
  line1:      { type: String, default: "" },
  line2:      { type: String, default: "" },   // optional, not scored
  city:       { type: String, default: "" },
  state:      { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country:    { type: String, default: "" },
},

business: {
  companyName:  { type: String, default: "" },
  businessType: { type: String, default: "" }, // see enum below
  designation:  { type: String, default: "" },
  industry:     { type: String, default: "" },
  gstin:        { type: String, default: "" },
  pan:          { type: String, default: "" },
  website:      { type: String, default: "" }, // optional, not scored
},

preferences: {
  language:               { type: String, default: "en" }, // en|hi|mr|gu|ta|te|bn|kn
  emailNotifications:     { type: Boolean, default: true },
  smsNotifications:       { type: Boolean, default: true },
  whatsappNotifications:  { type: Boolean, default: false },
  marketingEmails:        { type: Boolean, default: false },
},

authProviders: {
  password: { type: Boolean, default: false }, // true once a password is set
  google:   { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
},
```

**`businessType` enum values** (the frontend sends these exact strings):
`private_limited`, `opc`, `llp`, `partnership`, `proprietorship`, `public_limited`, `trust_ngo`, `unregistered`

**`authProviders` should be maintained by the auth controllers**, not the profile endpoint:
- set `password: true` on email signup and on password reset/change
- set `google: true` on a successful Google login for that account
- set `facebook: true` on a successful Facebook login for that account

The Security section reads these to show which methods are connected. Today they're all absent, so it renders "0 sign-in methods / Not linked" — populating them fixes that with no frontend change.

---

## 2. API changes needed

### `GET /api/client/users/me`

Must return all of the above in `data` (alongside the existing fields). No shape change beyond the new keys.

### `PATCH /api/client/users/me`

Currently documented as accepting only `{ name?, phone?, profileImage? }`. It needs to accept a **partial** body containing any of:

```json
{
  "name": "Aarav Sharma",
  "phone": "9876543210",
  "profileImage": "...",
  "dateOfBirth": "1994-03-18",
  "gender": "male",
  "address":     { "line1": "...", "line2": "...", "city": "...", "state": "...", "postalCode": "...", "country": "..." },
  "business":    { "companyName": "...", "businessType": "llp", "designation": "...", "industry": "...", "gstin": "...", "pan": "...", "website": "..." },
  "preferences": { "language": "en", "emailNotifications": true, "smsNotifications": true, "whatsappNotifications": false, "marketingEmails": false }
}
```

Important behaviour notes:

1. **The frontend saves one section at a time.** Each save sends only that section's own keys (e.g. opening "Address" and saving sends just `{ address: {...} }`). Merge partials — don't treat a missing key as "clear it".
2. **Nested objects are sent complete.** When `address` is present, every one of its six keys is included, so a plain `$set` on the whole subdocument is safe and correct.
3. **Email is never sent** — it's rendered read-only in the UI. Reject it server-side too if it ever appears.
4. **Return the updated user** in `data` so the page can reconcile its local state with what was actually persisted.

`PATCH /api/client/users/me/password` is already implemented and needs no change — the Security section uses it as-is.

---

## 3. How the completion percentage works

Computed **entirely on the frontend** — the backend does not need a `profileCompleted` field for this page (if one exists it's simply ignored here).

A field counts toward the score when it's marked `tracked: true` in the `SECTIONS` array in `src/app/dashboard/profile/page.tsx`. A tracked field is "filled" when its value is non-null and not an empty/whitespace string.

```
percent   = round(filledTrackedFields / totalTrackedFields * 100)
remaining = totalTrackedFields - filledTrackedFields
```

**Currently 17 tracked fields:**

| Section | Tracked fields | Count |
|---|---|---|
| Personal information | `name`, `email`, `phone`, `dateOfBirth`, `gender` | 5 |
| Address | `line1`, `city`, `state`, `postalCode`, `country` | 5 |
| Business profile | `companyName`, `businessType`, `designation`, `industry`, `gstin`, `pan` | 6 |
| Communication preferences | `language` | 1 |

Deliberately **not** tracked: `address.line2` and `business.website` (genuinely optional), the four notification booleans (`false` is a valid choice, not an empty field), and everything in Security (status, not data entry).

To change the scoring, add or flip `tracked` on a field definition — the percentage, the "N fields remaining" note, and each section's "N fields incomplete" / Complete badge all recompute automatically.

### Worth considering: individual vs business accounts

As it stands, a client with no company can never reach 100%, because the six business fields are always counted. If that matters, add:

```js
accountType: { type: String, enum: ["individual", "business"], default: "individual" }
```

and the frontend can then skip business fields in the score when `accountType === "individual"`. Not implemented yet — say the word and it's a small change.

---

## 4. UI behaviour (for reference)

- Each section is a collapsed row showing its title, how many fields are still empty, and a Complete/Incomplete badge.
- Clicking the arrow expands it into a prefilled form with **Save changes** and **Cancel** at the bottom.
- Cancel discards the draft and collapses the row; Save PATCHes only that section, then collapses and shows a confirmation.
- Only one section is open at a time — opening another closes the current one and discards its unsaved draft.
