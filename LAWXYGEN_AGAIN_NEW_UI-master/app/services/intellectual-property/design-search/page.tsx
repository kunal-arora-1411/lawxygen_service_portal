import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design Search | LAWXYGEN",
  description: "A specialist workflow for design search, from asset preparation through filing, response and record keeping.",
};

const data = {
  "title": "Design Search",
  "category": "Intellectual Property",
  "categorySlug": "intellectual-property",
  "accent": "#3B8DDB",
  "variant": 20,
  "archetype": "ip",
  "summary": "A specialist workflow for design search, from asset preparation through filing, response and record keeping.",
  "highlights": [
    "Asset-led intake",
    "Classification & route",
    "Evidence checklist",
    "Lifecycle tracking"
  ],
  "checklist": [
    [
      "Asset",
      "Define the mark, work, invention or design involved."
    ],
    [
      "Ownership",
      "Confirm who owns or is applying for the IP right."
    ],
    [
      "Classification",
      "Identify the relevant class, specification or filing basis."
    ],
    [
      "Evidence",
      "Keep use, creation, priority, assignment or technical evidence ready."
    ],
    [
      "History",
      "Collect earlier applications, registrations or notices if applicable."
    ]
  ],
  "overview": [
    "Design Search depends on the underlying intellectual property asset, ownership position and filing or enforcement route.",
    "A strong intake starts by identifying exactly what is being protected, searched, assigned or challenged and what evidence supports the claim.",
    "For contested or technical matters, specialist review can be added before a response or filing is finalised."
  ],
  "benefits": [
    [
      "Asset-first intake",
      "Start with the actual IP subject."
    ],
    [
      "Evidence discipline",
      "Keep supporting material close to the matter."
    ],
    [
      "Lifecycle view",
      "See filing, response and renewal points together."
    ],
    [
      "Specialist escalation",
      "Bring in IP expertise when the issue becomes technical or contested."
    ]
  ],
  "documents": [
    [
      "Owner details",
      "Applicant or owner identity and contact details."
    ],
    [
      "IP material",
      "Logo, artwork, claims, drawings, specification or other relevant file."
    ],
    [
      "Ownership evidence",
      "Assignments, creation records or prior-use evidence where applicable."
    ],
    [
      "Filing history",
      "Earlier applications, registrations, notices or office correspondence."
    ],
    [
      "Authorisation",
      "Power of attorney or signed authorisation when the route requires it."
    ]
  ],
  "process": [
    [
      "01 · Assess the asset",
      "Clarify the IP subject and desired outcome."
    ],
    [
      "02 · Check the route",
      "Select search, filing, renewal, assignment, response or advisory path."
    ],
    [
      "03 · Assemble evidence",
      "Organise ownership and supporting material."
    ],
    [
      "04 · Draft / file",
      "Prepare the application, response or record."
    ],
    [
      "05 · Monitor the matter",
      "Track examination, objections, correspondence or milestones."
    ],
    [
      "06 · Maintain the right",
      "Store the record and note future renewal or response dates."
    ]
  ],
  "faqs": [
    [
      "What is Design Search?",
      "Design Search is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to design search. The exact checklist can vary by case."
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
      "title": "Trademark Registration (Indian)",
      "href": "/services/intellectual-property/trademark-registration-indian"
    },
    {
      "title": "International Trademark Registration (Madrid Protocol)",
      "href": "/services/intellectual-property/international-trademark-registration-madrid-protocol"
    },
    {
      "title": "Trademark Search",
      "href": "/services/intellectual-property/trademark-search"
    },
    {
      "title": "Trademark Objection Reply",
      "href": "/services/intellectual-property/trademark-objection-reply"
    },
    {
      "title": "Trademark Opposition Reply",
      "href": "/services/intellectual-property/trademark-opposition-reply"
    },
    {
      "title": "Trademark Renewal",
      "href": "/services/intellectual-property/trademark-renewal"
    }
  ],
  "cta": "Start IP service",
  "note": "IP outcomes depend on the asset, ownership and applicable filing or enforcement route. Specialist review is recommended for contested or technical matters.",
  "bg": "#EAF4FF",
  "soft": "#D7E9FF"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
