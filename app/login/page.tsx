"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const [mode, setMode] = useState<"email" | "mobile">("email");
  return (
    <main className={styles.page}>
      <div className={styles.glow} />
      <section className={styles.card}>
        <Link href="/" className={styles.logo}><img src="/lawxygen-logo-clean.png" alt="LAWXYGEN" /></Link>
        <div className={styles.eyebrow}>SECURE CLIENT ACCESS</div>
        <h1>Log in or sign up.</h1>
        <p className={styles.lead}>Manage consultations, appointments, service requests and your LAWXYGEN account.</p>
        <div className={styles.socials}><button type="button"><span className={styles.google}>G</span>Continue with Google</button><button type="button"><span className={styles.apple}>●</span>Continue with Apple</button><button type="button"><span className={styles.facebook}>f</span>Continue with Facebook</button></div>
        <div className={styles.divider}><span>or continue with</span></div>
        <div className={styles.tabs}><button className={mode === "email" ? styles.active : ""} type="button" onClick={() => setMode("email")}>Email</button><button className={mode === "mobile" ? styles.active : ""} type="button" onClick={() => setMode("mobile")}>Mobile + OTP</button></div>
        {mode === "email" ? <><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="Enter your password" /></label><div className={styles.row}><label className={styles.check}><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div><button className={styles.submit} type="button">Continue <span>→</span></button></> : <><label>Mobile number<input type="tel" placeholder="+91 98765 43210" /></label><button className={styles.submit} type="button">Send OTP <span>→</span></button></>}
        <div className={styles.bottom}>New to LAWXYGEN? <a href="#">Create an account</a></div>
        <small className={styles.secure}>● Protected client access · Secure session</small>
      </section>
    </main>
  );
}
