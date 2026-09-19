import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Loan Agreement | LAWXYGEN",
  description: "Build loan agreement around the right parties, commercial terms, clauses and review points.",
};

const data = {
  "title": "Loan Agreement",
  "category": "Documentation",
  "categorySlug": "documentation",
  "accent": "#5B6EE1",
  "variant": 6,
  "archetype": "documentation",
  "summary": "Build loan agreement around the right parties, commercial terms, clauses and review points.",
  "highlights": [
    "Party details",
    "Commercial terms",
    "Clause review",
    "Final version"
  ],
  "checklist": [
    [
      "Parties",
      "Confirm legal names, addresses and roles."
    ],
    [
      "Purpose",
      "Describe the transaction, relationship or intended outcome."
    ],
    [
      "Commercial terms",
      "Prepare fees, deliverables, dates, milestones and responsibilities."
    ],
    [
      "Risk clauses",
      "Flag confidentiality, IP, liability, termination and dispute concerns where relevant."
    ],
    [
      "Existing documents",
      "Keep related agreements, policies or schedules available."
    ]
  ],
  "overview": [
    "Loan Agreement works best when the document reflects the actual transaction, relationship and commercial intent rather than generic wording.",
    "The page helps gather the parties, scope, responsibilities, dates and risk points before drafting begins.",
    "Where terms are negotiated or sensitive, a professional can review the final clauses before execution."
  ],
  "benefits": [
    [
      "Clearer expectations",
      "Put responsibilities in an organised document."
    ],
    [
      "Reduced ambiguity",
      "Surface missing terms before execution."
    ],
    [
      "Version control",
      "Keep the final agreed copy easy to find."
    ],
    [
      "Review when needed",
      "Escalate important or negotiated clauses to a professional."
    ]
  ],
  "documents": [
    [
      "Party information",
      "Names, addresses and authorised-signatory details."
    ],
    [
      "Commercial brief",
      "Scope, fee, timeline, deliverables and conditions."
    ],
    [
      "Schedules",
      "Specifications, statements of work, pricing or annexures."
    ],
    [
      "Existing agreements",
      "Prior documents that need to be aligned."
    ],
    [
      "Approvals",
      "Internal sign-off or authorisations where relevant."
    ]
  ],
  "process": [
    [
      "01 · Share the brief",
      "Explain the relationship, purpose and desired outcome."
    ],
    [
      "02 · Gather terms",
      "Collect commercial details, obligations and schedules."
    ],
    [
      "03 · Structure the draft",
      "Arrange definitions, responsibilities, rights and remedies."
    ],
    [
      "04 · Review clauses",
      "Check for ambiguity, gaps and conflicting terms."
    ],
    [
      "05 · Finalise",
      "Resolve comments and issue the execution-ready document."
    ],
    [
      "06 · Maintain the record",
      "Store the final version and supporting annexures together."
    ]
  ],
  "faqs": [
    [
      "What is Loan Agreement?",
      "Loan Agreement is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to loan agreement. The exact checklist can vary by case."
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
      "title": "Franchisee Agreement",
      "href": "/services/documentation/franchisee-agreement"
    },
    {
      "title": "Founder Agreement",
      "href": "/services/documentation/founder-agreement"
    },
    {
      "title": "Vendor Agreement",
      "href": "/services/documentation/vendor-agreement"
    },
    {
      "title": "Shareholders Agreement",
      "href": "/services/documentation/shareholders-agreement"
    },
    {
      "title": "Joint Venture Agreement",
      "href": "/services/documentation/joint-venture-agreement"
    },
    {
      "title": "Non-Disclosure Agreement (NDA)",
      "href": "/services/documentation/non-disclosure-agreement-nda"
    }
  ],
  "cta": "Start document request",
  "note": "Document suitability depends on the transaction and facts. Professional review is recommended for negotiated, sensitive or high-risk agreements.",
  "bg": "#EEF0FF",
  "soft": "#DDE3FF"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
