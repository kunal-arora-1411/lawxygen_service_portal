export function CTA() {
  return (
    <section id="contact" className="section-pad">
      <div className="container">
        <div className="cta-panel">
          <h2>Your next legal step should feel obvious.</h2>
          <p>
            The contact flow is frontend-only in V1. When the backend is added,
            the same form and UI can connect through the API layer without
            rebuilding these sections.
          </p>
          <div className="hero-actions">
            <a
              className="btn"
              href="mailto:hello@lawxygen.in"
              style={{ background: "white", color: "#111b45" }}
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
