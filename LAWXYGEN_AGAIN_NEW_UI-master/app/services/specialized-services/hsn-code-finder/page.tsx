import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "HSN Code Finder | LAWXYGEN",
  description: "A practical LAWXYGEN tool for hsn code finder with straightforward inputs, a clear result and guidance on what the result means.",
};

const data = {
  "title": "HSN Code Finder",
  "category": "Specialized Services",
  "categorySlug": "specialized-services",
  "accent": "#12A77A",
  "variant": 13,
  "archetype": "tool",
  "summary": "A practical LAWXYGEN tool for hsn code finder with straightforward inputs, a clear result and guidance on what the result means.",
  "highlights": [
    "Focused inputs",
    "Clear output",
    "Assumptions explained",
    "Related service path"
  ],
  "checklist": [
    [
      "Inputs",
      "Use current and accurate source values."
    ],
    [
      "Units",
      "Confirm period, frequency and measurement fields."
    ],
    [
      "Assumptions",
      "Read the explanation beside the output."
    ],
    [
      "Validation",
      "Check the result against your actual circumstances."
    ],
    [
      "Next step",
      "Open the related service when formal action is needed."
    ]
  ],
  "overview": [
    "HSN Code Finder is designed for a fast first answer, not a long intake journey.",
    "Enter the requested figures or lookup terms, review the output and read the assumptions beside the result.",
    "When the outcome requires a formal filing, payment or professional decision, use the related LAWXYGEN service instead of treating the tool as final advice."
  ],
  "benefits": [
    [
      "Fast",
      "Get a focused answer without a long form."
    ],
    [
      "Explainable",
      "Keep inputs and meaning near the result."
    ],
    [
      "Re-runnable",
      "Test different scenarios quickly."
    ],
    [
      "Actionable",
      "Move from calculation to the appropriate service when needed."
    ]
  ],
  "documents": [
    [
      "Source figures",
      "Use current figures from your records."
    ],
    [
      "Relevant period",
      "Enter the correct month, year, tenure or frequency."
    ],
    [
      "Rates / assumptions",
      "Confirm any rate or assumption shown by the tool."
    ],
    [
      "Supporting context",
      "Retain records needed to validate the output."
    ]
  ],
  "process": [
    [
      "01 · Enter values",
      "Provide the minimum inputs requested."
    ],
    [
      "02 · Calculate / search",
      "Run the tool."
    ],
    [
      "03 · Review the result",
      "Check the number, unit and explanation."
    ],
    [
      "04 · Test a scenario",
      "Change an input where a what-if comparison helps."
    ],
    [
      "05 · Validate",
      "Confirm assumptions against your records."
    ],
    [
      "06 · Take action",
      "Move to the relevant professional or compliance service when required."
    ]
  ],
  "faqs": [
    [
      "What is HSN Code Finder?",
      "HSN Code Finder is a LAWXYGEN service pathway focused on the outcome described on this page. The precise route depends on the client facts and the applicable workflow."
    ],
    [
      "What should I prepare before starting?",
      "Keep the client profile, core matter details and the supporting records relevant to hsn code finder. The exact checklist can vary by case."
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
  "cta": "Open the tool",
  "note": "Tool outputs are informational. Validate inputs and assumptions before relying on them for formal legal, tax or financial action.",
  "bg": "#E8F8F2",
  "soft": "#D2EFE5"
};

export default function Page() {
  return <ServicePageTemplate data={data} styles={styles} />;
}
