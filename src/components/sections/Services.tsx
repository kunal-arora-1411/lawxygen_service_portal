import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="section-pad">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Core services</span>
          <h2>Built to make complex work feel simple.</h2>
          <p>
            This first frontend version keeps content modular so the final
            service list can be connected to the backend later without
            redesigning the page.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a className="service-link" href="#contact">
                View service →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
