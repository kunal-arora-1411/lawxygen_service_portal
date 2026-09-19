import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OSP (Other Service Provider) License | LAWXYGEN",
  description: "A clear LAWXYGEN workflow for osp (other service provider) license, with concise guidance, preparation and an obvious next action.",
};

const data = {
  "title": "OSP (Other Service Provider) License",
  "category": "Certifications",
  "categorySlug": "certifications",
  "accent": "#D58A16",
  "variant": 23,
  "archetype": "general",
  "summary": "A clear LAWXYGEN workflow for osp (other service provider) license, with concise guidance, preparation and an obvious next action.",
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
    "OSP (Other Service Provider) License is presented as a focused LAWXYGEN service journey rather than a generic information page.",
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
      "What is OSP (Other Service Provider) License?",
      "OSP (Other Service Provider) License is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to osp (other service provider) license. The exact checklist can vary by case."
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
      "title": "FSSAI Food License Registration (Basic / State / Central)",
      "href": "/services/certifications/fssai-food-license-registration-basic-state-central"
    },
    {
      "title": "FSSAI License Renewal",
      "href": "/services/certifications/fssai-license-renewal"
    },
    {
      "title": "Shop & Establishment Act Registration",
      "href": "/services/certifications/shop-and-establishment-act-registration"
    },
    {
      "title": "Import Export Code (IEC) Registration",
      "href": "/services/certifications/import-export-code-iec-registration"
    },
    {
      "title": "IEC Modification / Surrender",
      "href": "/services/certifications/iec-modification-surrender"
    },
    {
      "title": "MSME / Udyog Aadhaar Registration",
      "href": "/services/certifications/msme-udyog-aadhaar-registration"
    }
  ],
  "cta": "Start this service",
  "note": "Requirements and outcomes can vary by circumstances. Confirm the applicable route with the appropriate professional.",
  "bg": "#FFF5E5",
  "soft": "#FFE9BB"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
