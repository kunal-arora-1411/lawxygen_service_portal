import { api, WHATSAPP_RATE_PAISE, type WhatsappTemplate } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { SyncButton } from "./SyncButton";
import { TemplateComposer } from "./TemplateComposer";
import styles from "../admin.module.css";

/**
 * WhatsApp templates.
 *
 * Every message Lawxygen sends first — before a client has written to it — has to be
 * one of these, approved by Meta in advance. Lawxygen authors them here and submits
 * them itself; there is no other console in the loop.
 */

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<WhatsappTemplate["status"], string> = {
  approved: "live",
  pending: "pending",
  draft: "draft",
  rejected: "alert",
  paused: "alert",
  disabled: "alert",
};

const STATUS_MEANING: Record<WhatsappTemplate["status"], string> = {
  approved: "Can be sent",
  pending: "With Meta for review",
  draft: "Not submitted",
  rejected: "Meta refused it — resubmit under a new name",
  paused: "Meta paused it for poor quality",
  disabled: "Meta disabled it",
};

export default async function AdminWhatsappPage() {
  const result = await api.call<WhatsappTemplate[]>("/admin/whatsapp/templates", {
    cookie: await forwardedCookie(),
  });
  const templates = result.ok ? result.data : [];
  const approved = templates.filter((t) => t.status === "approved").length;
  const marketing = templates.filter((t) => t.category === "marketing");

  return (
    <>
      <h1 className={styles.title}>WhatsApp templates</h1>
      <p className={styles.sub}>
        Anything sent before a client writes to us must be an approved template. Meta reviews each
        one, usually within minutes, sometimes over a day.
      </p>

      <div className={styles.banner}>
        <strong>Meta decides the category, not us.</strong>A utility message costs about ₹
        {(WHATSAPP_RATE_PAISE.utility / 100).toFixed(2)} and a marketing one about ₹
        {(WHATSAPP_RATE_PAISE.marketing / 100).toFixed(2)} — seven and a half times more, for the
        life of the template. Meta classifies from the wording, so keep transactional messages
        plainly transactional.
      </div>

      {/* Worth surfacing: a template silently reclassified is a standing cost. */}
      {marketing.length > 0 && (
        <div className={styles.warn}>
          <strong>
            {marketing.length} template{marketing.length === 1 ? " is" : "s are"} classified as
            marketing
          </strong>
          {marketing.map((t) => t.name).join(", ")} — each message costs roughly seven times a
          utility one. If that was not intended, rewrite and resubmit under a new name.
        </div>
      )}

      <div className={styles.actions}>
        <TemplateComposer />
        <SyncButton />
      </div>

      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>
        {templates.length === 0
          ? "No templates yet"
          : `${String(approved)} of ${String(templates.length)} ready to send`}
      </h2>

      <div className={styles.tableWrap}>
        {templates.length === 0 ? (
          <div className={styles.empty}>
            Nothing here yet. Write the first one — a payment receipt and an assignment notice are
            what the system needs to start sending on its own.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Message</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={`${template.name}:${template.language}`}>
                  <td>
                    <div className={styles.serviceName}>{template.name}</div>
                    <div className={styles.serviceMeta}>
                      {template.language}
                      {template.variables.length > 0 && ` · ${template.variables.join(", ")}`}
                    </div>
                  </td>
                  <td className={styles.muted}>{template.bodyPreview ?? "—"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        template.category === "marketing" ? styles.alert : styles.active
                      }`}
                    >
                      {template.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[STATUS_TONE[template.status]] ?? ""}`}
                    >
                      {template.status}
                    </span>
                    <div className={styles.serviceMeta}>{STATUS_MEANING[template.status]}</div>
                    {template.reviewNote && (
                      <div className={styles.rowError}>{template.reviewNote}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
