import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Income Tax Audit (Section 44AB) | LAWXYGEN",
  description: "Keep income tax audit (section 44ab) organised around records, review points and the next filing or response.",
};

const data = {
  "title": "Income Tax Audit (Section 44AB)",
  "category": "Talk to a CA",
  "categorySlug": "talk-ca",
  "accent": "#E15A93",
  "variant": 16,
  "archetype": "compliance",
  "summary": "Keep income tax audit (section 44ab) organised around records, review points and the next filing or response.",
  "highlights": [
    "Period-aware",
    "Record review",
    "Submission path",
    "Follow-up"
  ],
  "checklist": [
    [
      "Scope",
      "Identify the entity, reporting period and compliance event."
    ],
    [
      "Source records",
      "Keep returns, books, registers, invoices or statements relevant to the period."
    ],
    [
      "Reconciliation",
      "Resolve obvious mismatches before the formal action begins."
    ],
    [
      "Supporting evidence",
      "Keep notices, prior filings, workings and attachments together."
    ],
    [
      "Review point",
      "Flag exceptions that need professional judgement."
    ]
  ],
  "overview": [
    "Income Tax Audit (Section 44AB) is most effective when the source records are prepared before the filing, review or response stage begins.",
    "The right checklist depends on the client profile, period and applicable requirement, so the page keeps the workflow modular rather than forcing one universal list.",
    "A visible next-action model makes recurring work easier to hand off, review and close."
  ],
  "benefits": [
    [
      "Better deadline awareness",
      "Keep the next compliance event visible."
    ],
    [
      "Cleaner source data",
      "Organise records before review."
    ],
    [
      "Review checkpoints",
      "Create a deliberate pause before submission."
    ],
    [
      "Follow-through",
      "Keep acknowledgements and next actions together."
    ]
  ],
  "documents": [
    [
      "Entity details",
      "PAN, GSTIN, CIN/LLPIN or other applicable identifiers."
    ],
    [
      "Period records",
      "Books, returns, ledgers, invoices or statements."
    ],
    [
      "Prior submissions",
      "Filed copies, acknowledgements and notices when relevant."
    ],
    [
      "Supporting schedules",
      "Reconciliations, workings or attachments needed for the matter."
    ],
    [
      "Authorisation",
      "Applicable signatory or professional authorisation details."
    ]
  ],
  "process": [
    [
      "01 · Define the obligation",
      "Confirm what must be filed, reviewed, replied to or maintained."
    ],
    [
      "02 · Gather period records",
      "Collect the supporting information and prior submissions."
    ],
    [
      "03 · Reconcile",
      "Check consistency between source records and the action to be taken."
    ],
    [
      "04 · Prepare",
      "Build the return, response, schedule or compliance record."
    ],
    [
      "05 · Submit / respond",
      "Use the required filing or response route."
    ],
    [
      "06 · Close & calendar",
      "Save the acknowledgement and note the next relevant compliance date."
    ]
  ],
  "faqs": [
    [
      "What is Income Tax Audit (Section 44AB)?",
      "Income Tax Audit (Section 44AB) is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to income tax audit (section 44ab). The exact checklist can vary by case."
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
      "title": "CA Consultation – Accounting & Taxation",
      "href": "/services/talk-ca/ca-consultation-accounting-and-taxation"
    },
    {
      "title": "Tax Planning & Advisory",
      "href": "/services/talk-ca/tax-planning-and-advisory"
    },
    {
      "title": "GST Advisory & Consultation",
      "href": "/services/talk-ca/gst-advisory-and-consultation"
    },
    {
      "title": "Income Tax Notice Reply / Assessment Support",
      "href": "/services/talk-ca/income-tax-notice-reply-assessment-support"
    },
    {
      "title": "Transfer Pricing Documentation",
      "href": "/services/talk-ca/transfer-pricing-documentation"
    },
    {
      "title": "GST Audit Support",
      "href": "/services/talk-ca/gst-audit-support"
    }
  ],
  "cta": "Start compliance",
  "note": "Compliance requirements can vary with the period, entity and current rules. Confirm the applicable requirement before filing.",
  "bg": "#FFF0F6",
  "soft": "#FFDDEB"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
