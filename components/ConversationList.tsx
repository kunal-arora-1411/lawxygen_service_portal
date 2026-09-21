"use client";

import { useCallback, useEffect, useState } from "react";
import {
  API_ORIGIN,
  windowRemaining,
  type ApiResult,
  type AssignableMember,
  type WhatsappConversation,
} from "@/lib/api";
import { Chat } from "./Chat";
import styles from "./ConversationList.module.css";

/**
 * A list of threads beside the open one.
 *
 * Shared by both dashboards. The list is the client component rather than the page,
 * because selecting a thread and sending a reply both have to refresh it — the unread
 * count, the window countdown and who holds it all move — and doing that through a
 * server round trip would make the chat feel like a form.
 */
export function ConversationList({
  basePath,
  manageable,
}: {
  basePath: string;
  /** Admin only: whether assignment controls appear. */
  manageable?: boolean;
}) {
  const [conversations, setConversations] = useState<WhatsappConversation[] | null>(null);
  const [members, setMembers] = useState<AssignableMember[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API_ORIGIN}${basePath}/conversations`, {
        credentials: "include",
      });
      const result = (await response.json()) as ApiResult<WhatsappConversation[]>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setConversations(result.data);
      // Open the most recent by default, so the page is never an empty right-hand pane.
      setSelected((current) => current ?? result.data[0]?.id ?? null);
    } catch {
      setError("Could not reach Lawxygen.");
    }
  }, [basePath]);

  /**
   * The first fetch is scheduled rather than called in the effect body. React 19
   * rejects a synchronous setState there, and the rule is right: this is a
   * subscription to an external system, so every update should arrive through the
   * timer's callback rather than as a cascading render.
   */
  useEffect(() => {
    const run = () => void load();
    const first = setTimeout(run, 0);
    const timer = setInterval(run, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    if (!manageable) return;
    const load = async () => {
      try {
        const response = await fetch(`${API_ORIGIN}${basePath}/members`, {
          credentials: "include",
        });
        const result = (await response.json()) as ApiResult<AssignableMember[]>;
        if (result.ok) setMembers(result.data);
      } catch {
        // Assignment simply stays unavailable; the thread is still readable.
      }
    };
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [basePath, manageable]);

  const open = conversations?.find((conversation) => conversation.id === selected) ?? null;

  if (error) return <div className={styles.empty}>{error}</div>;

  if (conversations && conversations.length === 0) {
    return (
      <div className={styles.empty}>
        <strong>No conversations yet.</strong>A thread appears here the first time a client replies
        on WhatsApp.
      </div>
    );
  }

  return (
    <div className={styles.split}>
      <aside className={styles.list}>
        {conversations === null ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          conversations.map((conversation) => {
            const remaining = windowRemaining(conversation.replyWindowExpiresAt);
            return (
              <button
                key={conversation.id}
                type="button"
                className={styles.row}
                aria-current={conversation.id === selected ? "true" : undefined}
                onClick={() => setSelected(conversation.id)}
              >
                <span className={styles.rowTop}>
                  <span className={styles.rowName}>
                    {conversation.clientName ??
                      conversation.contactName ??
                      `+${conversation.contactPhone}`}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className={styles.unread}>
                      {conversation.unreadCount}
                      <span className="visually-hidden"> unread</span>
                    </span>
                  )}
                </span>
                <span className={styles.rowMeta}>
                  {conversation.status === "resolved"
                    ? "Resolved"
                    : conversation.windowOpen
                      ? (remaining ?? "Open")
                      : "Window closed"}
                  {conversation.assignedName && ` · ${conversation.assignedName}`}
                </span>
              </button>
            );
          })
        )}
      </aside>

      <div className={styles.pane}>
        {open ? (
          <Chat
            conversation={open}
            basePath={basePath}
            {...(manageable ? { members } : {})}
            onChanged={() => void load()}
          />
        ) : (
          <div className={styles.empty}>Choose a conversation.</div>
        )}
      </div>
    </div>
  );
}
