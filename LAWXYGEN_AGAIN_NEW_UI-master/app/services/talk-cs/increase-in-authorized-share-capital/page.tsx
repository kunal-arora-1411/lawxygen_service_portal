import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Increase in Authorized Share Capital | LAWXYGEN",
  description: "A focused consultation path for increase in authorized share capital, designed to make the issue easy for the right professional to assess.",
};

const data = {
  "title": "Increase in Authorized Share Capital",
  "category": "Talk to a CS",
  "categorySlug": "talk-cs",
  "accent": "#9466F2",
  "variant": 22,
  "archetype": "consultation",
  "summary": "A focused consultation path for increase in authorized share capital, designed to make the issue easy for the right professional to assess.",
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
    "Increase in Authorized Share Capital benefits from strong issue framing before a professional starts analysing the matter.",
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
      "What is Increase in Authorized Share Capital?",
      "Increase in Authorized Share Capital is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to increase in authorized share capital. The exact checklist can vary by case."
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
      "title": "Company Secretary (CS) Consultation",
      "href": "/services/talk-cs/company-secretary-cs-consultation"
    },
    {
      "title": "ROC Annual Filing Advisory",
      "href": "/services/talk-cs/roc-annual-filing-advisory"
    },
    {
      "title": "Board Resolution Drafting",
      "href": "/services/talk-cs/board-resolution-drafting"
    },
    {
      "title": "Minutes of Meetings (AGM / EGM)",
      "href": "/services/talk-cs/minutes-of-meetings-agm-egm"
    },
    {
      "title": "Director KYC (DIR-3 KYC)",
      "href": "/services/talk-cs/director-kyc-dir-3-kyc"
    },
    {
      "title": "Appointment / Resignation of Director",
      "href": "/services/talk-cs/appointment-resignation-of-director"
    }
  ],
  "cta": "Request expert help",
  "note": "The service page organises the intake; final professional advice depends on the facts and documents provided.",
  "bg": "#F2EEFF",
  "soft": "#E5DEFF"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
