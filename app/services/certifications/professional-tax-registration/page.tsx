import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Professional Tax Registration | LAWXYGEN",
  description: "A guided path for professional tax registration that keeps preparation, filing and follow-up easy to understand.",
};

const data = {
  "title": "Professional Tax Registration",
  "category": "Certifications",
  "categorySlug": "certifications",
  "accent": "#16A8B2",
  "variant": 17,
  "archetype": "registration",
  "summary": "A guided path for professional tax registration that keeps preparation, filing and follow-up easy to understand.",
  "highlights": [
    "Clear starting point",
    "Preparation checklist",
    "Guided workflow",
    "Expert escalation"
  ],
  "checklist": [
    [
      "Outcome",
      "Confirm exactly what you want the registration or approval to achieve."
    ],
    [
      "Applicant profile",
      "Keep names, identity details, entity or promoter information consistent."
    ],
    [
      "Address records",
      "Prepare the relevant business, office or residence evidence when applicable."
    ],
    [
      "Authorisation",
      "Keep signatures, declarations, resolutions or authority details ready where required."
    ],
    [
      "Final review",
      "Check spellings, dates, addresses and attachments before submission."
    ]
  ],
  "overview": [
    "Professional Tax Registration is a structured business or legal setup service. The first step is to understand who is applying, what outcome is required and which route applies.",
    "LAWXYGEN separates preparation from submission so users can see what is ready and what still needs attention.",
    "Where the matter involves an authority review, the client workspace can keep acknowledgements, clarifications and completion records together."
  ],
  "benefits": [
    [
      "A clear starting point",
      "Know what the service is solving before you begin."
    ],
    [
      "Fewer avoidable corrections",
      "Review core information before filing."
    ],
    [
      "Visible milestones",
      "See what has been completed and what comes next."
    ],
    [
      "Reusable records",
      "Keep final documents organised for later compliance."
    ]
  ],
  "documents": [
    [
      "Identity records",
      "Applicant/director/promoter identity and contact details as applicable."
    ],
    [
      "Address proof",
      "Current address or registered-office evidence where relevant."
    ],
    [
      "Business information",
      "Activities, ownership, capital, structure or other service inputs."
    ],
    [
      "Supporting papers",
      "Authorisations, declarations, resolutions and related documents as applicable."
    ],
    [
      "Existing registrations",
      "Earlier approvals, registrations or identifiers where they form part of the workflow."
    ]
  ],
  "process": [
    [
      "01 · Clarify the route",
      "Confirm the applicant, entity, purpose and applicable authority."
    ],
    [
      "02 · Collect inputs",
      "Bring the required identity, address and business information together."
    ],
    [
      "03 · Validate the file",
      "Review names, ownership, activities and supporting evidence."
    ],
    [
      "04 · Prepare the filing",
      "Complete the applicable application and linked documents."
    ],
    [
      "05 · Track responses",
      "Monitor acknowledgement, clarification or resubmission requests."
    ],
    [
      "06 · Store the result",
      "Keep the final approval, certificate or filing record available for future use."
    ]
  ],
  "faqs": [
    [
      "What is Professional Tax Registration?",
      "Professional Tax Registration is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to professional tax registration. The exact checklist can vary by case."
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
  "bg": "#EAF8F9",
  "soft": "#D4EEF1"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
