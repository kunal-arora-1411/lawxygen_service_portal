import { ConversationList } from "@/components/ConversationList";
import styles from "../admin.module.css";

/**
 * Every WhatsApp thread, and who is answering it.
 *
 * Admin sees all of them, can hand one to a professional, take it over, or resolve it.
 * Resolving also unassigns, so the client's next message returns to the unassigned
 * queue rather than sitting unread in somebody's list.
 */

export const dynamic = "force-dynamic";

export default function AdminConversationsPage() {
  return (
    <>
      <h1 className={styles.title}>Conversations</h1>
      <p className={styles.sub}>
        Every WhatsApp thread. A free reply is only possible within 24 hours of the client&apos;s
        last message — outside that, send an approved template from their order.
      </p>

      <ConversationList basePath="/admin/whatsapp" manageable />
    </>
  );
}
