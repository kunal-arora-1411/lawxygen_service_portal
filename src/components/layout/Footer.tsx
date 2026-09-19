import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="contact"
      className="v5-footer"
    >
      <div className="v5-footer-cta">
        <div>
          <span>NEED SOME DIRECTION?</span>

          <h2>
            Find the right legal
            step for your business.
          </h2>
        </div>

        <div>
          <a
            href="/services"
            className="v5-footer-primary"
          >
            Explore Services
            <span>↗</span>
          </a>

          <a href="/services/talk-lawyer">
            Talk to an Expert
            <span>→</span>
          </a>
        </div>
      </div>

      <div className="v5-footer-main">
        <div className="v5-footer-about">
          <div className="v5-footer-logo">
            <Image
              src="/lawxygen-logo-clean.png"
              alt="LAWXYGEN"
              width={220}
              height={120}
            />
          </div>

          <p>
            Legal, tax, compliance, business and
            professional services designed around
            a clearer experience.
          </p>
        </div>

        <div className="v5-footer-links">
          <div>
            <span>Business</span>

            <a href="/services">
              Company Registration
            </a>

            <a href="/services">
              LLP Registration
            </a>

            <a href="/services">
              Startup Services
            </a>

            <a href="/services">
              Business Licences
            </a>
          </div>

          <div>
            <span>Compliance</span>

            <a href="/services/tax-compliance">
              GST
            </a>

            <a href="/services/tax-compliance">
              Income Tax
            </a>

            <a href="/services/tax-compliance">
              ROC Compliance
            </a>

            <a href="/services/tax-compliance">
              Payroll
            </a>
          </div>

          <div>
            <span>Experts</span>

            <a href="/services/talk-lawyer">
              Talk to a Lawyer
            </a>

            <a href="/services/talk-lawyer">
              Talk to a CA
            </a>

            <a href="/services/talk-lawyer">
              Talk to a CS
            </a>

            <a href="/services/talk-lawyer">
              Talk to an IP Lawyer
            </a>
          </div>

          <div>
            <span>LAWXYGEN</span>

            <a href="/">About</a>

            <a href="/">Contact</a>

            <a href="/">Privacy</a>

            <a href="/">Terms</a>
          </div>
        </div>
      </div>

      <div className="v5-footer-popular">
        <span>POPULAR SERVICES</span>

        <div>
          <a href="/services">
            Private Limited Company
          </a>

          <a href="/services">
            GST Registration
          </a>

          <a href="/services">
            Trademark
          </a>

          <a href="/services">
            FSSAI
          </a>

          <a href="/services">
            Legal Documentation
          </a>
        </div>
      </div>

      <div className="v5-footer-bottom">
        <span>© 2026 LAWXYGEN</span>

        <strong>
          BREATHE LEGAL EASE
        </strong>

        <span>INDIA</span>
      </div>
    </footer>
  );
}