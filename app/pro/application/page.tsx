import Link from "next/link";
import { redirect } from "next/navigation";
import { api, type ProfessionalApplication } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ApplicationSteps } from "./ApplicationSteps";
import styles from "../pro.module.css";

/**
 * Where an applicant lives until they are verified.
 *
 * The checklist is the whole design. "Incomplete" tells somebody nothing; naming the
 * three things and ticking them off as they land is the difference between finishing
 * and abandoning.
 */

export const dynamic = "force-dynamic";

const STATUS_COPY: Record<ProfessionalApplication["status"], { title: string; note: string }> = {
  draft: {
    title: "Your application",
    note: "Nothing has been sent yet. Finish the three items below and send it when you are ready.",
  },
  pending_review: {
    title: "With us for review",
    note: "We are checking your registration against the public register. This usually takes a couple of working days.",
  },
  verified: {
    title: "You are verified",
    note: "Turn yourself available on your dashboard and matters will start arriving automatically.",
  },
  rejected: {
    title: "We could not verify this",
    note: "The reason is on your registration below. Correct it and send it back — nothing else is lost.",
  },
  suspended: {
    title: "Your account is suspended",
    note: "You will not be offered new matters. Contact us to sort it out.",
  },
};

export default async function ApplicationPage() {
  const result = await api.call<ProfessionalApplication>("/pro/application", {
    cookie: await forwardedCookie(),
  });

  // Nobody has applied on this account. The apply page is the right place, not an error.
  if (!result.ok) redirect("/pro/apply");

  const application = result.data;
  const copy = STATUS_COPY[application.status];

  return (
    <>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.sub}>{copy.note}</p>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Before we can review it</h2>
        <ul className={styles.checklist}>
          {application.readiness.map((check) => (
            <li key={check.key} className={check.done ? styles.done : styles.todo}>
              <span aria-hidden="true">{check.done ? "✓" : "○"}</span>
              <span>
                {check.label}
                <span className="visually-hidden">
                  {check.done ? " — done" : " — still needed"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>About you</h2>
        <div className={styles.summary}>
          <div>
            <span className={styles.label}>Name clients see</span>
            {application.displayName}
          </div>
          {application.headline && (
            <div>
              <span className={styles.label}>What you do</span>
              {application.headline}
            </div>
          )}
          <div>
            <span className={styles.label}>Categories</span>
            {application.categories.length > 0
              ? application.categories.map((c) => c.label).join(", ")
              : "None chosen yet"}
          </div>
          <div>
            <span className={styles.label}>Matters at once</span>
            {application.concurrentCapacity}
          </div>
        </div>
      </section>

      <ApplicationSteps application={application} />

      {application.status === "verified" && (
        <p className={styles.help}>
          <Link href="/pro">Go to your dashboard →</Link>
        </p>
      )}
    </>
  );
}
