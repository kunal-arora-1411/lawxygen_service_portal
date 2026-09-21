import { ConversationList } from "@/components/ConversationList";
import styles from "../pro.module.css";

/**
 * The professional's WhatsApp.
 *
 * Only the clients on matters they currently hold — enforced by the API, which filters
 * through the assignment rather than trusting the page.
 */

export const dynamic = "force-dynamic";

export default function ProChatPage() {
  return (
    <>
      <h1 className={styles.title}>Messages</h1>
      <p className={styles.sub}>
        WhatsApp threads with your clients. You can reply freely for 24 hours after a client writes
        to you; after that, only an approved template will reach them.
      </p>

      <ConversationList basePath="/pro/whatsapp" />
    </>
  );
}
