import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Change of Registered Office | LAWXYGEN",
  description: "A clear LAWXYGEN workflow for change of registered office, with concise guidance, preparation and an obvious next action.",
};

const data = {
  "title": "Change of Registered Office",
  "category": "Tax & Compliance",
  "categorySlug": "tax-compliance",
  "accent": "#12A77A",
  "variant": 13,
  "archetype": "general",
  "summary": "A clear LAWXYGEN workflow for change of registered office, with concise guidance, preparation and an obvious next action.",
  "highlights": [
    "Clear starting point",
    "Preparation checklist",
    "Guided workflow",
    "Expert escalation"
  ],
  "checklist": [
    [
      "Fit",
      "Confirm the service matches the outcome you need."
    ],
    [
      "Core details",
      "Prepare the relevant client and matter information."
    ],
    [
      "Records",
      "Keep supporting material available."
    ],
    [
      "Timing",
      "Flag important deadlines or dependencies."
    ],
    [
      "Review",
      "Bring in an expert when judgement is required."
    ]
  ],
  "overview": [
    "Change of Registered Office is presented as a focused LAWXYGEN service journey rather than a generic information page.",
    "The experience separates the starting decision, preparation and next action so the user can understand the service quickly.",
    "When the matter becomes fact-specific, the workflow gives the user a clear path to professional help."
  ],
  "benefits": [
    [
      "Clarity",
      "Understand the service before acting."
    ],
    [
      "Preparation",
      "Know what to gather."
    ],
    [
      "Progress",
      "Keep the next action visible."
    ],
    [
      "Support",
      "Escalate case-specific questions."
    ]
  ],
  "documents": [
    [
      "Client details",
      "Identity, contact and service-specific information."
    ],
    [
      "Supporting records",
      "Documents relevant to the request."
    ],
    [
      "Prior history",
      "Earlier filings, agreements or correspondence where relevant."
    ],
    [
      "Output context",
      "Information needed to complete or validate the result."
    ]
  ],
  "process": [
    [
      "01 · Start the request",
      "Describe the outcome you need."
    ],
    [
      "02 · Gather details",
      "Collect the information and records that matter."
    ],
    [
      "03 · Confirm the route",
      "Check the applicable workflow."
    ],
    [
      "04 · Complete the action",
      "Prepare the filing, document or service step."
    ],
    [
      "05 · Track the result",
      "Monitor follow-up and responses."
    ],
    [
      "06 · Store the record",
      "Keep the completed outcome and next milestone."
    ]
  ],
  "faqs": [
    [
      "What is Change of Registered Office?",
      "Change of Registered Office is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to change of registered office. The exact checklist can vary by case."
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
      "title": "New GST Registration",
      "href": "/services/tax-compliance/new-gst-registration"
    },
    {
      "title": "GST Return Filing (GSTR-1, GSTR-3B, GSTR-9)",
      "href": "/services/tax-compliance/gst-return-filing-gstr-1-gstr-3b-gstr-9"
    },
    {
      "title": "GST Annual Return Filing (GSTR-9C)",
      "href": "/services/tax-compliance/gst-annual-return-filing-gstr-9c"
    },
    {
      "title": "GST Cancellation",
      "href": "/services/tax-compliance/gst-cancellation"
    },
    {
      "title": "GST Amendment / Modification",
      "href": "/services/tax-compliance/gst-amendment-modification"
    },
    {
      "title": "GST Advisory & Consultation",
      "href": "/services/tax-compliance/gst-advisory-and-consultation"
    }
  ],
  "cta": "Start this service",
  "note": "Requirements and outcomes can vary by circumstances. Confirm the applicable route with the appropriate professional.",
  "bg": "#E8F8F2",
  "soft": "#D2EFE5"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
