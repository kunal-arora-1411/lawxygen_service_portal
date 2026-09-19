/**
 * The only place this app talks to the API.
 *
 * Every response uses one envelope, and the portal switches on `code` — never on
 * message text and never on HTTP status alone. Keeping that in one module means a
 * change to the contract is a change to one file rather than a hunt through call sites.
 *
 * **Known gap.** These types are hand-written to mirror the backend's Zod schemas, so
 * nothing structurally prevents them drifting — and drift surfaces as a runtime bug in
 * production rather than a compile error. The fix is the one named in the delivery
 * plan: emit an OpenAPI document from those schemas and generate this file. Doing that
 * before the first screen existed would have been the wrong order; doing it before real
 * traffic would not be.
 */

export type ErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "invalid_input"
  | "conflict"
  | "rate_limited"
  | "upstream_failure"
  | "internal";

export type ApiFailure = {
  ok: false;
  code: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

export type Page<T> = { items: T[]; nextCursor: string | null };

export class ApiClientError extends Error {
  readonly code: ErrorCode;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(failure: ApiFailure) {
    super(failure.message);
    this.name = "ApiClientError";
    this.code = failure.code;
    this.fieldErrors = failure.fieldErrors;
  }
}

export const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:4000";

type RequestOptions = {
  method?: string;
  body?: unknown;
  /** Server components pass the incoming Cookie header; the browser sends it itself. */
  cookie?: string;
  /** Most portal data is per-user and must never be cached across requests. */
  cache?: RequestCache;
};

async function call<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.cookie) headers.cookie = options.cookie;

  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      // The session is an httpOnly cookie on a sibling host, so it only travels when
      // credentials are included. Without this every request is anonymous.
      credentials: "include",
      cache: options.cache ?? "no-store",
    });
  } catch {
    // The API being unreachable is not a contract failure; it still has to arrive as
    // one so callers have a single shape to handle.
    return {
      ok: false,
      code: "upstream_failure",
      message: "Could not reach Lawxygen. Check your connection and try again.",
    } satisfies ApiFailure;
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    return { ok: false, code: "internal", message: "The server sent an unreadable response." };
  }

  return parsed as ApiResult<T>;
}

/** Throws on failure. For call sites where an error should bubble to an error boundary. */
export async function apiOrThrow<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const result = await call<T>(path, options);
  if (!result.ok) throw new ApiClientError(result);
  return result.data;
}

export const api = { call };

// ---------------------------------------------------------------------------
// Resource shapes
// ---------------------------------------------------------------------------

export type SessionUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "client" | "professional" | "admin" | "superadmin";
};

export type Category = {
  slug: string;
  label: string;
  accent: string | null;
  serviceCount: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  categorySlug: string;
  categoryLabel: string;
  fulfilmentType: "service" | "consultation";
  pricePaise: number;
  currency: string;
  turnaroundDays: number | null;
  featured: boolean;
};

export type OrderStatus =
  | "payment_pending"
  | "payment_failed"
  | "paid"
  | "awaiting_assignment"
  | "assigned"
  | "assignment_escalated"
  | "in_progress"
  | "awaiting_client"
  | "completed"
  | "cancelled"
  | "refunded";

export type Order = {
  reference: string;
  status: OrderStatus;
  serviceTitle: string;
  serviceSlug: string;
  categorySlug: string;
  fulfilmentType: "service" | "consultation";
  pricePaise: number;
  currency: string;
  turnaroundDays: number | null;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

/** Integer paise in, Indian-grouped rupees out. Display only — never arithmetic. */
export function formatPrice(paise: number, currency = "INR"): string {
  const rupees = Math.floor(paise / 100);
  const symbol = currency === "INR" ? "₹" : `${currency} `;
  return `${symbol}${rupees.toLocaleString("en-IN")}`;
}

/**
 * What the client is told, which is deliberately not the internal status.
 *
 * `payment_failed` reads as "Payment pending" — support needs the distinction, the
 * client needs a retry. And every flavour of "we have not staffed this yet" reads the
 * same: the platform's difficulty finding a professional is not the client's problem
 * to interpret.
 */
export const ORDER_LABELS: Record<OrderStatus, string> = {
  payment_pending: "Payment pending",
  payment_failed: "Payment pending",
  paid: "Matching you with a professional",
  awaiting_assignment: "Matching you with a professional",
  assignment_escalated: "Matching you with a professional",
  assigned: "Assigned — awaiting confirmation",
  in_progress: "In progress",
  awaiting_client: "Awaiting your documents",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function orderTone(status: OrderStatus): "pending" | "active" | "done" | "closed" {
  switch (status) {
    case "payment_pending":
    case "payment_failed":
      return "pending";
    case "completed":
      return "done";
    case "cancelled":
    case "refunded":
      return "closed";
    default:
      return "active";
  }
}

// ---------------------------------------------------------------------------
// Admin resources
// ---------------------------------------------------------------------------

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  categorySlug: string;
  categoryLabel: string;
  fulfilmentType: "service" | "consultation";
  /** Null until priced. The database refuses to publish a service while it is. */
  pricePaise: number | null;
  currency: string;
  turnaroundDays: number | null;
  active: boolean;
  featured: boolean;
};

export type AdminProfessional = {
  id: string;
  displayName: string;
  kind: string;
  status: "draft" | "pending_review" | "verified" | "suspended" | "rejected";
  available: boolean;
  city: string | null;
  email: string | null;
  phone: string | null;
  categories: string[];
  concurrentCapacity: number;
  openMatters: number;
  /** Without one the assignment engine skips them, however verified they are. */
  hasPayoutIdentity: boolean;
  createdAt: string;
};

export type AdminOrder = {
  reference: string;
  status: OrderStatus;
  serviceTitle: string;
  categorySlug: string;
  pricePaise: number;
  currency: string;
  createdAt: string;
  clientName: string | null;
  clientEmail: string | null;
  professionalName: string | null;
  acknowledgeBy: string | null;
  /** Decided by the database's clock, not by comparing against Date.now() in render. */
  acknowledgeOverdue: boolean;
};

export type AdminOverview = {
  orders: { total: number; today: number; awaitingAssignment: number; escalated: number };
  revenuePaise: { today: number; allTime: number };
  professionals: { verified: number; pendingReview: number; available: number };
  catalogue: { total: number; priced: number; live: number; featured: number };
  queue: { awaiting: number; escalated: number };
};

/**
 * Rupees in, paise out.
 *
 * Admin types whole rupees; the API only ever accepts integer paise. The conversion
 * happens here, on a string validated as digits, so no decimal and no float is ever
 * involved in deciding what something costs.
 */
export function rupeesToPaise(input: string): number | null {
  const trimmed = input.trim().replace(/,/g, "");
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed) * 100;
}

export function paiseToRupees(paise: number | null): string {
  return paise === null ? "" : String(Math.floor(paise / 100));
}

// ---------------------------------------------------------------------------
// Professional resources
// ---------------------------------------------------------------------------

export type MatterStatus =
  | "assigned"
  | "acknowledged"
  | "in_progress"
  | "awaiting_client"
  | "completed"
  | "declined"
  | "revoked"
  | "escalated";

export type Matter = {
  assignmentId: string;
  status: MatterStatus;
  reference: string;
  serviceTitle: string;
  categorySlug: string;
  /** Null once acknowledged. Past means the sweep will escalate it. */
  acknowledgeBy: string | null;
  acknowledgedAt: string | null;
  createdAt: string;
  /** Decided by the database clock, not by comparing against Date.now() in render. */
  acknowledgeOverdue: boolean;
  /** Released only once the matter is theirs — contact happens off-platform. */
  client: { name: string | null; email: string | null; phone: string | null } | null;
};

export type ProLoad = {
  open: number;
  capacity: number;
  available: boolean;
  status: "draft" | "pending_review" | "verified" | "suspended" | "rejected";
};

export type Earnings = {
  /** Attributed in the ledger and not yet paid out. */
  pendingPaise: number;
  paidPaise: number;
  matters: { completed: number; open: number };
};

export const MATTER_LABELS: Record<MatterStatus, string> = {
  assigned: "Needs your confirmation",
  acknowledged: "Confirmed",
  in_progress: "In progress",
  awaiting_client: "Waiting on the client",
  completed: "Completed",
  declined: "Declined",
  revoked: "Taken back by admin",
  escalated: "Escalated — not confirmed in time",
};

/** Whether this matter still occupies one of the professional's concurrent slots. */
export function isOpenMatter(status: MatterStatus): boolean {
  return ["assigned", "acknowledged", "in_progress", "awaiting_client"].includes(status);
}

// ---------------------------------------------------------------------------
// Payouts
// ---------------------------------------------------------------------------

export type PayableBalance = {
  professionalId: string;
  displayName: string;
  /** Already net of withholding — TDS was deducted at capture, not at payout. */
  amountPaise: number;
  tdsPaise: number;
  accountLast4: string;
};

export type PayoutBatch = {
  reference: string;
  status: "draft" | "releasing" | "released" | "cancelled";
  totalPaise: number;
  payoutCount: number;
  createdAt: string;
  releasedAt: string | null;
  note: string | null;
};

export type PayoutHistoryRow = {
  reference: string;
  amountPaise: number;
  tdsPaise: number;
  /** Which section the withholding was under, as applied at the time. */
  tdsSection: string | null;
  status: "pending" | "paid" | "failed" | "skipped";
  accountLast4: string | null;
  paidAt: string | null;
  createdAt: string;
};
