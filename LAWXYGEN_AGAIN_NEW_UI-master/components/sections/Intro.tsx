import { Reveal } from "@/components/ui/Reveal";

export function Intro() {
  return (
    <section className="lx-intro">
      <div className="lx-container">
        <Reveal>
          <div className="lx-section-index">
            <span>01</span>
            <span>Why LAWXYGEN</span>
          </div>
        </Reveal>

        <div className="lx-intro-layout">
          <Reveal>
            <h2>
              Business moves fast.
              <br />
              Legal services should too.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="lx-intro-copy">
              <p>
                Legal and compliance work should not feel fragmented,
                intimidating or unnecessarily complicated.
              </p>

              <p>
                LAWXYGEN brings essential business services into a single
                clear journey — from incorporation and taxation to
                intellectual property, documentation and specialist advice.
              </p>

              <a href="#services">
                Discover the LAWXYGEN approach
                <span>↗</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lx-intro-line">
          <Reveal delay={50}>
            <div>
              <strong>Start</strong>
              <span>Set up your business correctly.</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <strong>Manage</strong>
              <span>Stay compliant as you operate.</span>
            </div>
          </Reveal>

          <Reveal delay={190}>
            <div>
              <strong>Protect</strong>
              <span>Secure your brand and legal interests.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}