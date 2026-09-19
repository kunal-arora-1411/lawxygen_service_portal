import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Angel / Seed Investment Legal Support | LAWXYGEN",
  description: "Bring the facts, documents and decision points together before taking the next step on angel / seed investment legal support.",
};

const data = {
  "title": "Angel / Seed Investment Legal Support",
  "category": "Specialized Services",
  "categorySlug": "specialized-services",
  "accent": "#2F80ED",
  "variant": 0,
  "archetype": "advisory",
  "summary": "Bring the facts, documents and decision points together before taking the next step on angel / seed investment legal support.",
  "highlights": [
    "Issue framing",
    "Evidence pack",
    "Expert routing",
    "Next action"
  ],
  "checklist": [
    [
      "Issue summary",
      "Explain the situation in plain language."
    ],
    [
      "Objective",
      "State the decision or outcome you want."
    ],
    [
      "Evidence",
      "Collect agreements, notices, statements, filings or transaction documents."
    ],
    [
      "Timeline",
      "List important dates and actions already taken."
    ],
    [
      "Constraints",
      "Flag deadlines, counterparties, budget or other limits."
    ]
  ],
  "overview": [
    "Angel / Seed Investment Legal Support benefits from strong issue framing before a professional starts analysing the matter.",
    "LAWXYGEN turns the situation into a concise working brief covering the objective, supporting documents and constraints.",
    "The workflow can then route the matter to the appropriate professional and preserve the action trail for follow-up."
  ],
  "benefits": [
    [
      "Better briefing",
      "Give the professional usable context from the beginning."
    ],
    [
      "Right-fit routing",
      "Match the matter to the relevant expertise."
    ],
    [
      "Action clarity",
      "Leave with a specific next step."
    ],
    [
      "Continuity",
      "Keep the working record ready for follow-up."
    ]
  ],
  "documents": [
    [
      "Client profile",
      "Basic identity, entity and contact information."
    ],
    [
      "Matter papers",
      "Contracts, notices, filings, statements or transaction materials."
    ],
    [
      "Timeline",
      "Important dates, previous actions and current status."
    ],
    [
      "Decision context",
      "Commercial objectives, preferred outcome and constraints."
    ],
    [
      "Prior advice",
      "Earlier professional notes or correspondence when relevant."
    ]
  ],
  "process": [
    [
      "01 · Capture the issue",
      "Turn the situation into a concise brief."
    ],
    [
      "02 · Organise the evidence",
      "Bring together the records relevant to the question."
    ],
    [
      "03 · Route the matter",
      "Choose the professional or specialist path that matches the issue."
    ],
    [
      "04 · Review options",
      "Discuss practical routes, risks and dependencies."
    ],
    [
      "05 · Decide the next action",
      "Convert the discussion into a clear follow-up."
    ],
    [
      "06 · Preserve continuity",
      "Keep notes, documents and decisions together."
    ]
  ],
  "faqs": [
    [
      "What is Angel / Seed Investment Legal Support?",
      "Angel / Seed Investment Legal Support is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to angel / seed investment legal support. The exact checklist can vary by case."
    ],
    [
      "Can the workflow be handled online?",
      "Where the applicable process supports online preparation, submission or communication, the LAWXYGEN workspace is designed to keep the journey digital and trackable."
    ],
    [
      "What happens if my case is unusual?",
      "The workflow can be escalated to the appropriate lawyer, CA, CS or specialist so case-specific judgement can be applied."
    ],
    [
      "How do I track the next step?",
      "The service workspace is designed to keep the current stage, open requirement and next action visible."
    ],
    [
      "Does this page include final legal or tax advice?",
      "No. This page is an organised service guide. Final advice depends on the facts, documents and professional review where required."
    ]
  ],
  "related": [
    {
      "title": "GST Calculator",
      "href": "/services/specialized-services/gst-calculator"
    },
    {
      "title": "TDS Calculator",
      "href": "/services/specialized-services/tds-calculator"
    },
    {
      "title": "HRA Calculator",
      "href": "/services/specialized-services/hra-calculator"
    },
    {
      "title": "Gratuity Calculator",
      "href": "/services/specialized-services/gratuity-calculator"
    },
    {
      "title": "SIP Calculator",
      "href": "/services/specialized-services/sip-calculator"
    },
    {
      "title": "NPS Calculator",
      "href": "/services/specialized-services/nps-calculator"
    }
  ],
  "cta": "Request expert help",
  "note": "The service page organises the intake; final professional advice depends on the facts and documents provided.",
  "bg": "#EAF3FF",
  "soft": "#D4E7FF"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
