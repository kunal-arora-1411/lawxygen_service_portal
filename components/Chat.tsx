"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  API_ORIGIN,
  windowRemaining,
  type ApiResult,
  type AssignableMember,
  type WhatsappChatMessage,
  type WhatsappConversation,
} from "@/lib/api";
import styles from "./Chat.module.css";

/**
 * A WhatsApp thread.
 *
 * Shared by the professional dashboard and the admin console; `basePath` decides which
 * API answers, and the API decides what each may see. Admin additionally gets the
 * assignment controls.
 *
 * **The 24-hour window is the whole design.** WhatsApp only permits a free-form reply
 * within 24 hours of the client's last message, and nothing we send reopens it — only
 * the client writing again does. So the composer is not a plain textbox: it shows how
 * long is left, and when the window has closed it says so and points at the template
 * route instead of failing on send.
 */

const POLL_MS = 15_000;

export function Chat({
  conversation,
  basePath,
  members,
  onChanged,
}: {
  conversation: WhatsappConversation;
  /** `/pro/whatsapp` or `/admin/whatsapp`. */
  basePath: string;
  /** Admin only. Absent for a professional, who cannot reassign. */
  members?: AssignableMember[];
  onChanged?: () => void;
}) {
  const [messages, setMessages] = useState<WhatsappChatMessage[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_ORIGIN}${basePath}/conversations/${conversation.id}/messages`,
        { credentials: "include" },
      );
      const result = (await response.json()) as ApiResult<WhatsappChatMessage[]>;
      if (result.ok) setMessages(result.data);
    } catch {
      // A failed poll is not worth an error banner; the next one will try again.
    }
  }, [basePath, conversation.id]);

  /**
   * Polling rather than sockets, matching the rest of the portal — a professional
   * watching one or two threads does not need a persistent connection.
   *
   * The first fetch is scheduled rather than called in the effect body, because React
   * 19 rejects a synchronous setState there and is right to: every update should
   * arrive through the timer's callback.
   */
  useEffect(() => {
    const run = () => void load();
    const first = setTimeout(run, 0);
    const timer = setInterval(run, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_ORIGIN}${basePath}/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: body }),
        },
      );
      const result = (await response.json()) as ApiResult<WhatsappChatMessage>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setText("");
      setMessages((current) => [...(current ?? []), result.data]);
      onChanged?.();
    } catch {
      setError("Could not reach Lawxygen.");
    } finally {
      setBusy(false);
    }
  }

  async function manage(action: string, assigneeUserId?: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}${basePath}/conversations/${conversation.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, ...(assigneeUserId ? { assigneeUserId } : {}) }),
      });
      const result = (await response.json()) as ApiResult<WhatsappConversation>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onChanged?.();
    } catch {
      setError("Could not reach Lawxygen.");
    } finally {
      setBusy(false);
    }
  }

  const remaining = windowRemaining(conversation.replyWindowExpiresAt);

  return (
    <div className={styles.chat}>
      <header className={styles.head}>
        <div>
          <div className={styles.who}>
            {conversation.clientName ?? conversation.contactName ?? conversation.contactPhone}
          </div>
          <div className={styles.meta}>
            +{conversation.contactPhone}
            {conversation.assignedName && ` · with ${conversation.assignedName}`}
            {conversation.status === "resolved" && " · resolved"}
          </div>
        </div>

        {/* The countdown belongs in the header, not next to the send button: it is
            context for the whole conversation, not a property of one message. */}
        {conversation.windowOpen ? (
          <span className={styles.windowOpen}>{remaining ?? "Open"}</span>
        ) : (
          <span className={styles.windowShut}>Reply window closed</span>
        )}
      </header>

      {members && (
        <div className={styles.manage}>
          <select
            className={styles.select}
            value={conversation.assignedUserId ?? ""}
            onChange={(e) => void manage("assign", e.target.value)}
            disabled={busy}
            aria-label="Assign this conversation"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? member.id.slice(0, 8)} · {member.role}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => void manage("takeover")}
            disabled={busy}
          >
            Take it
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => void manage(conversation.status === "open" ? "resolve" : "reopen")}
            disabled={busy}
          >
            {conversation.status === "open" ? "Resolve" : "Reopen"}
          </button>
        </div>
      )}

      <div className={styles.thread}>
        {messages === null ? (
          <div className={styles.empty}>Loading…</div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>Nothing in this thread yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={message.direction === "inbound" ? styles.inbound : styles.outbound}
            >
              <div className={styles.bubble}>
                {message.body ?? <em className={styles.meta}>[{message.type}]</em>}
              </div>
              <div className={styles.stamp}>
                {new Date(message.occurredAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {message.sentByName && ` · ${message.sentByName}`}
                {message.status && ` · ${message.status}`}
                {message.failedReason && (
                  <span className={styles.failed}> · {message.failedReason}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottom} />
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {conversation.windowOpen ? (
        <div className={styles.composer}>
          <textarea
            className={styles.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends, shift-enter breaks the line — what a chat does.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={2}
            maxLength={4096}
            placeholder="Write a reply…"
            disabled={busy}
          />
          <button
            type="button"
            className={styles.send}
            onClick={() => void send()}
            disabled={busy || !text.trim()}
          >
            Send
          </button>
        </div>
      ) : (
        /* Explained rather than disabled in silence — a professional who cannot type
           and is told nothing concludes the product is broken. */
        <div className={styles.closed}>
          <strong>You cannot type here right now.</strong>
          {conversation.replyWindowExpiresAt
            ? " WhatsApp only allows a free reply within 24 hours of the client's last message, and that has passed."
            : " This client has not written to us on WhatsApp yet."}{" "}
          Send an approved template from their order to reopen the conversation.
        </div>
      )}
    </div>
  );
}
