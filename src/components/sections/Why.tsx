const points = [
  ["Clear process", "No confusing journey. Each service has a visible next step."],
  ["Mobile first", "The UI is designed to remain strong and usable on smaller screens."],
  ["Backend ready", "Data and API boundaries are separated from the visual components."],
];

export function Why() {
  return (
    <section id="why" className="section-pad" style={{ paddingTop: 28 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
          }}
        >
          {points.map(([title, description]) => (
            <div
              key={title}
              className="glass"
              style={{
                borderRadius: 22,
                padding: 28,
                display: "grid",
                gridTemplateColumns: "minmax(160px, .4fr) 1fr",
                gap: 26,
                alignItems: "start",
              }}
            >
              <strong style={{ fontSize: 21 }}>{title}</strong>
              <span className="muted" style={{ fontSize: 17, lineHeight: 1.7 }}>
                {description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
