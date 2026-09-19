export type ServiceContent = {
  hero: string;
  overview: string;
  highlights: string[];
  eligibility: string[];
  benefits: [string, string][];
  documents: [string, string[]][];
  process: [string, string][];
  pricing: string;
  faqs: [string, string][];
  tutorial: string;
  help: string;
};

const clean = (title: string) => title.replace(/\s+/g, " ").trim();
const lc = (title: string) => clean(title).toLowerCase();

const serviceType = (title: string, category: string) => {
  const s = lc(title);
  if (/calculator|finder|tool/.test(s)) return "tool";
  if (/consultation|advisory|advice|support|dispute|defense|litigation|recovery|petition/.test(s)) return category.includes("Lawyer") || category === "Talk to a Lawyer" ? "legal" : "advisory";
  if (/agreement|deed|letter|affidavit|power of attorney|will|policy|notice|drafting/.test(s)) return "document";
  if (/trademark|copyright|patent|design|ip|intellectual property/.test(s)) return "ip";
  if (/registration|incorporation|recognition|license|licence|certification|certificate/.test(s)) return category === "Certifications" ? "certification" : "registration";
  if (/return filing|filing|audit|compliance|tax|gst|tds|roc|pf|esi|esic|payroll|accounting|bookkeeping/.test(s)) return "compliance";
  return "business";
};

const generators: Record<string, (title: string, category: string) => ServiceContent> = {
  registration: (title, category) => ({
    hero: `${title} through a clear LAWXYGEN service journey—prepare the right information, complete the required steps and keep the next action visible.`,
    overview: `${title} is organised as a guided registration journey for users who want a clear route from requirement discovery to submission and completion. The exact route, authority requirements and supporting records depend on the service and the user's circumstances.`,
    highlights: ["Service-specific preparation", "Guided submission flow", "Document review", "Progress visibility"],
    eligibility: ["The applicant or business can be clearly identified", "The selected registration matches the intended activity or structure", "Required supporting information can be provided for review", "Any service-specific conditions can be checked before submission"],
    benefits: [["Clear starting point", `Understand what ${title} is for before you begin.`], ["Organised documents", "Keep identity, address and supporting records easy to review."], ["Guided progression", "Move through the service in a visible order instead of guessing the next step."], ["Expert escalation", "Reach a professional when your situation needs case-specific review."]],
    documents: [["Applicant / business details", ["Name and contact details", "Identity information", "Basic business or activity details"]], ["Supporting records", ["Address or registration proof where applicable", "Existing certificates or records where relevant", "Additional service-specific documents"]]],
    process: [["01", "Confirm the requirement",],["02", "Collect the required information",],["03", "Review the supporting documents",],["04", "Prepare the application or registration",],["05", "Submit through the relevant process",],["06", "Track completion and the next action",]],
    pricing: "Pricing is based on the service scope, government requirements and the final LAWXYGEN package. Final pricing can be shown here once approved.",
    faqs: [[`What is ${title}?`, `It is a LAWXYGEN service route designed to help you prepare, submit and track the requirement named on this page.`],["What should I keep ready?", "Keep your basic applicant or business information and the records connected to the selected service ready. The final checklist can vary by case."],["Can LAWXYGEN help after submission?", "Where follow-up or compliance support applies, the service journey can continue with status updates and expert assistance."],["Can I speak to an expert?", "Yes. The Talk to an Expert action can route the requirement to the relevant professional category."]],
    tutorial: `A short expert walkthrough can explain what to prepare for ${title}, what to expect at each stage and which common mistakes to avoid.`,
    help: `Not sure whether ${title} is the right route? Start with a LAWXYGEN expert and get the requirement mapped before you submit.`,
  }),
  compliance: (title, category) => ({
    hero: `${title} without the clutter. Keep records, filing stages and follow-up actions organised in one focused LAWXYGEN workflow.`,
    overview: `${title} is presented as a recurring or event-driven compliance workflow. LAWXYGEN keeps the information, filing task, review stage and next action together so users can move through the requirement with less friction.`,
    highlights: ["Requirement review", "Records preparation", "Filing support", "Follow-up visibility"],
    eligibility: ["The taxpayer, entity or employee/business record can be identified", "The relevant period, notice or filing event is known", "Supporting records can be shared for review", "Any prior filing or correspondence is available where relevant"],
    benefits: [["Filing clarity", "See what needs to be prepared before the work starts."],["Record readiness", "Keep the tax or compliance records that matter in one place."],["Follow-up visibility", "Make the next review or filing action easy to spot."],["Professional review", "Escalate notices, exceptions or case-specific issues to an expert."]],
    documents: [["Core records", ["Registration or identification details", "Relevant returns, ledgers or statements", "Period-specific records"]],["Supporting evidence", ["Notices or correspondence when applicable", "Previous filings or acknowledgements", "Additional records requested for review"]]],
    process: [["01", "Define the filing or compliance requirement"],["02", "Collect the relevant period records"],["03", "Review and reconcile the inputs"],["04", "Prepare the filing or response"],["05", "Submit or complete the action"],["06", "Track acknowledgements and follow-up"]],
    pricing: "The final fee depends on the records, period, complexity and level of professional support required. LAWXYGEN pricing can be published here after approval.",
    faqs: [[`What does ${title} cover?`, `This page focuses on the specific ${title} workflow and keeps the required records, filing activity and follow-up actions organised.`],["What if I received a notice?", "Share the notice and relevant records so the applicable response path can be reviewed before action is taken."],["Can recurring compliance be tracked?", "Yes. The service experience is designed so recurring tasks and next actions can be surfaced clearly once the account workflow is connected."],["Do I need an expert?", "Routine preparation can be guided on the page; case-specific issues can be routed to the appropriate professional."]],
    tutorial: `An expert-led walkthrough can show how ${title} fits into the wider filing cycle, what records to prepare and where users commonly lose time.`,
    help: `Need a quick compliance check before you file? Talk to an expert and get the right next action identified.`,
  }),
  ip: (title, category) => ({
    hero: `${title} with a cleaner intellectual-property workflow—from identifying the asset or issue to organising evidence and deciding the next protection or enforcement step.`,
    overview: `${title} sits within LAWXYGEN's intellectual-property services. The page keeps ownership details, supporting material, filing or response stages and professional review in one focused experience.`,
    highlights: ["Asset-focused workflow", "Ownership review", "Evidence organisation", "Expert IP support"],
    eligibility: ["The IP asset, right or dispute can be identified", "Applicant, owner or claimant details are available", "Relevant records or evidence can be shared", "The intended outcome is clear enough to choose the right service path"],
    benefits: [["Focused IP handling", "Keep the specific trademark, copyright, patent or design issue central to the journey."],["Evidence ready", "Organise certificates, applications, artwork, drafts or correspondence as applicable."],["Action clarity", "Understand whether the next step is filing, response, renewal, assignment or escalation."],["Specialist review", "Move directly to an IP professional for case-specific advice."]],
    documents: [["Ownership & applicant records", ["Owner or applicant details", "Existing registration or application references", "Assignment or authority documents where applicable"]],["Issue-specific evidence", ["Creative or technical material", "Notices, objections or correspondence", "Usage or infringement evidence when relevant"]]],
    process: [["01", "Identify the IP requirement"],["02", "Collect ownership and supporting records"],["03", "Review the relevant filing or evidence"],["04", "Prepare the filing, response or action"],["05", "Complete the next formal step"],["06", "Track follow-up and professional review"]],
    pricing: "IP work is scoped according to the specific asset, filing/response stage and professional effort required. Final LAWXYGEN pricing can be added after approval.",
    faqs: [[`What is ${title}?`, `It is an IP-focused LAWXYGEN workflow for the specific protection, filing, management or enforcement requirement on this page.`],["What records are useful?", "Ownership details, existing registrations or applications and evidence related to the asset or issue are usually useful starting points."],["Can I discuss this with an IP expert?", "Yes. The page can route you to an IP professional when your situation needs a case-specific review."],["Can related IP services be added later?", "Yes. Related IP routes can be connected from the service page so users can move from one stage to another."]],
    tutorial: `Use the expert tutorial slot to explain the difference between preparation, filing, response and post-registration actions for ${title}.`,
    help: `Protecting an idea or responding to an IP issue? Talk to an expert and map the correct next move.`,
  }),
  document: (title, category) => ({
    hero: `${title} with a clean drafting and review path. Put the purpose, parties, terms and final handover into one focused LAWXYGEN workflow.`,
    overview: `${title} is presented as a document-first service. The experience helps users define the purpose, collect the relevant commercial or personal details, review the draft and move to finalisation with fewer loose ends.`,
    highlights: ["Purpose-first drafting", "Structured review", "Clear party details", "Final document handover"],
    eligibility: ["The purpose of the document is clear", "The parties or stakeholders can be identified", "Key commercial, personal or transaction terms are available", "Existing drafts or supporting documents can be shared when relevant"],
    benefits: [["Purpose clarity", "Make the reason for the document visible before drafting begins."],["Readable review", "Keep important terms and responsibilities easier to check."],["Better handover", "Keep final files and supporting records organised together."],["Expert escalation", "Bring in a professional when the document needs specialised legal review."]],
    documents: [["Party details", ["Names and contact details", "Identification details when required", "Authority or ownership records where applicable"]],["Transaction / terms", ["Commercial terms", "Dates and responsibilities", "Existing drafts, schedules or supporting records"]]],
    process: [["01", "Define the document purpose"],["02", "Collect party and transaction details"],["03", "Prepare the first draft"],["04", "Review the important terms"],["05", "Refine and finalise"],["06", "Deliver the completed document"]],
    pricing: "Drafting scope depends on the document type, complexity and level of review. Final LAWXYGEN pricing can be shown here once approved.",
    faqs: [[`What is ${title}?`, `It is a focused LAWXYGEN documentation workflow for preparing and reviewing the document named on this page.`],["What should I share first?", "Start with the purpose, parties and key terms. Existing drafts or supporting documents can be added if available."],["Can the document be revised?", "Yes. The workflow can support review and refinement before final handover."],["Can a lawyer review it?", "Yes. Use Talk to an Expert when the document or transaction needs professional legal review."]],
    tutorial: `An expert tutorial can walk through the main clauses, information requirements and review checkpoints relevant to ${title}.`,
    help: `Want the document prepared around your actual transaction? Talk to an expert before you start drafting.`,
  }),
  legal: (title, category) => ({
    hero: `${title} with a direct path to the right legal professional, the right documents and the right next conversation.`,
    overview: `${title} is built around expert-led support. LAWXYGEN helps the user describe the issue, organise the context and supporting records, and then move to the most useful legal next step.`,
    highlights: ["Requirement triage", "Relevant legal category", "Secure document sharing", "Consultation follow-through"],
    eligibility: ["The legal issue can be summarised clearly enough to begin", "The people or entities involved can be identified", "Relevant notices, contracts or records can be shared", "The user is seeking guidance within the selected legal category"],
    benefits: [["Relevant professional", "Route the matter toward the legal speciality that fits the issue."],["Focused consultation", "Keep the conversation centered on facts, documents and the decision needed."],["Action summary", "Make the next practical step easier to understand after the consultation."],["Follow-through", "Continue into document, filing, appointment or case-support workflows where applicable."]],
    documents: [["Matter summary", ["Short issue description", "Names of parties or entities", "Key dates and events"]],["Supporting records", ["Notices or correspondence", "Agreements or contracts", "Other evidence relevant to the matter"]]],
    process: [["01", "Describe the legal issue"],["02", "Share the relevant context"],["03", "Organise supporting documents"],["04", "Match the matter to an expert"],["05", "Discuss the issue"],["06", "Choose the next action"]],
    pricing: "Consultation and legal support fees depend on the matter, professional category and service scope. Final pricing can be displayed here after LAWXYGEN approval.",
    faqs: [[`How does ${title} work?`, `Start by describing the issue and sharing the documents that matter. LAWXYGEN can then route the requirement to the relevant professional workflow.`],["Can I book a lawyer?", "Yes. The expert-help flow can lead to a consultation or appointment when professional time is required."],["What should I bring to the consultation?", "Bring a concise issue summary, the key timeline and the documents connected to the matter."],["Will the page decide the legal outcome?", "No. The page helps organise the requirement; case-specific legal advice belongs with the appropriate professional."]],
    tutorial: `An expert video can explain how to prepare for a ${title} consultation, what documents help and how to make the discussion productive.`,
    help: `Prefer to speak to someone now? Connect with the right LAWXYGEN legal professional for your requirement.`,
  }),
  tool: (title, category) => ({
    hero: `${title} in a compact, decision-friendly LAWXYGEN tool experience—enter the right inputs, review the result and move to the next service when needed.`,
    overview: `${title} is designed as a utility-led experience. The result is intended to help users understand a scenario or starting point; the final action may still require records, context or professional review.`,
    highlights: ["Focused inputs", "Instant output", "Readable result", "Service handoff"],
    eligibility: ["You have the figures or details needed for the tool", "The tool matches the question you are trying to answer", "You understand that the result is a guide and not a substitute for case-specific professional advice"],
    benefits: [["Quick setup", "Keep the number of inputs focused on what the tool actually needs."],["Readable output", "Present the result without unnecessary clutter."],["Context-aware next step", "Move from the result into the relevant LAWXYGEN service when useful."],["Expert fallback", "Reach a professional when the scenario needs interpretation beyond the tool."]],
    documents: [["Inputs", ["Personal or business details as applicable", "Numbers, dates or records used by the calculation", "Any extra inputs requested by the specific tool"]]],
    process: [["01", "Choose the calculation or lookup"],["02", "Enter the required inputs"],["03", "Review the result"],["04", "Understand what the result means"],["05", "Move to a related LAWXYGEN service if needed"]],
    pricing: "Tool access can be kept transparent and lightweight; any paid service triggered after the tool can be priced separately.",
    faqs: [[`What does ${title} do?`, `It provides a focused utility experience for the specific calculation or lookup named on this page.`],["Can the result be final advice?", "No. Use the result as a guide and seek professional review when the decision depends on your specific facts."],["Can I continue into another LAWXYGEN service?", "Yes. Related-service links can take you directly to the relevant next workflow."],["Do I need to sign in?", "Basic tool access can remain open; account-based features can be connected later as the web app evolves."]],
    tutorial: `A short walkthrough can show the correct inputs for ${title}, how to read the result and when to move from the tool to an expert-led service.`,
    help: `Need help interpreting the result? Talk to a LAWXYGEN expert before you act.`,
  }),
  certification: (title, category) => ({
    hero: `${title} with an application-ready checklist, clear supporting records and visible progress from preparation to completion.`,
    overview: `${title} is organised as a registration, licence or certification journey. LAWXYGEN keeps the applicant details, operating information, documents, application steps and post-approval actions easy to follow.`,
    highlights: ["Application readiness", "Document checklist", "Approval tracking", "Renewal awareness"],
    eligibility: ["The applicant or business is clearly identified", "The activity or establishment falls within the selected registration or certification scope", "Required operational and address information is available", "Supporting proofs can be shared for review"],
    benefits: [["Application readiness", "Know what to prepare before the application starts."],["Clear checklist", "Keep certificates, proofs and operational records organised."],["Progress visibility", "Make the current application stage easy to understand."],["Post-approval support", "Keep renewal or ongoing obligations visible when applicable."]],
    documents: [["Applicant / establishment", ["Identity or entity details", "Address and operational information", "Contact details"]],["Service-specific proofs", ["Existing registrations or certificates", "Activity-specific supporting records", "Other documents requested for the selected licence or certification"]]],
    process: [["01", "Confirm the applicable registration"],["02", "Collect applicant and activity details"],["03", "Review the supporting records"],["04", "Prepare and submit the application"],["05", "Track review and approval"],["06", "Store the final certificate and next due action"]],
    pricing: "Certification and licensing cost depends on the authority, scope and professional support required. Final LAWXYGEN pricing can be added after approval.",
    faqs: [[`What is ${title}?`, `It is a LAWXYGEN registration or certification workflow built to keep preparation, submission and follow-up in one place.`],["What documents are needed?", "The checklist varies by activity, entity and authority. Start with applicant, address and operating information before moving to the service-specific documents."],["Can renewals be tracked?", "Where renewal applies, the dashboard can surface the next due action once the account workflow is connected."],["Can I get expert help?", "Yes. Talk to an expert if the licence or certification depends on a complex business activity or unusual case."]],
    tutorial: `A short expert video can explain what the registration covers, what to keep ready and how the approval journey usually progresses.`,
    help: `Not sure which licence or certification fits? Talk to an expert and confirm the right route first.`,
  }),
  advisory: (title, category) => ({
    hero: `${title} designed as a focused advisory journey—define the issue, bring the relevant records and move toward a practical next action.`,
    overview: `${title} is an expert-support workflow that turns an open-ended question into a structured review. The experience is designed around the information, records and decisions that matter for the selected advisory requirement.`,
    highlights: ["Issue framing", "Focused records", "Expert review", "Action summary"],
    eligibility: ["The question, decision or review requirement is identifiable", "Relevant financial, tax or business records can be shared", "The user's objective is clear enough to scope the advisory work"],
    benefits: [["Focused scope", "Start with the decision that needs to be made rather than a generic consultation."],["Useful records", "Bring the financial or business information that actually supports the review."],["Clear output", "Turn the discussion into a practical next-action summary."],["Follow-up path", "Continue into filing, compliance, documentation or implementation services where relevant."]],
    documents: [["Context", ["Business or personal profile", "Decision or issue summary", "Relevant dates and milestones"]],["Supporting records", ["Statements, returns or agreements", "Notices or communications", "Other records relevant to the advisory question"]]],
    process: [["01", "Define the decision or issue"],["02", "Collect the relevant records"],["03", "Review the information"],["04", "Discuss with the appropriate expert"],["05", "Document the recommended next action"],["06", "Continue into implementation if required"]],
    pricing: "Advisory fees depend on the matter, records involved and professional scope. Final LAWXYGEN pricing can be displayed after approval.",
    faqs: [[`What is ${title}?`, `It is a focused LAWXYGEN advisory route for the business, tax, finance or professional requirement named on this page.`],["What should I share before the consultation?", "A short issue summary and the records connected to the decision are the best starting point."],["Can this become a service request?", "Yes. Advisory discussions can lead into a filing, documentation, compliance or specialist workflow where appropriate."],["Who will review the matter?", "The route can be connected to the relevant professional category based on the service."]],
    tutorial: `An expert walkthrough can explain what information makes ${title} easier to review and how to turn the discussion into an actionable plan.`,
    help: `Have a decision that needs a professional view? Start the conversation with the relevant LAWXYGEN expert.`,
  }),
  business: (title, category) => ({
    hero: `${title} with a clearer business-first journey—organise the requirement, move through the key stages and keep the next action visible.`,
    overview: `${title} is presented as a focused LAWXYGEN business service. The page keeps the core requirement, preparation, supporting documents and follow-up actions together while leaving case-specific decisions to the appropriate professional.`,
    highlights: ["Business context", "Action-led structure", "Document readiness", "Expert support"],
    eligibility: ["The business or applicant can be identified", "The selected service matches the intended business need", "The relevant business records are available", "Service-specific conditions can be checked before action"],
    benefits: [["Business clarity", `Understand what ${title} is meant to solve.`],["Better preparation", "Collect the information that will actually be used in the next stage."],["Visible progress", "Keep the current stage and next action easy to follow."],["Expert support", "Move to the appropriate professional whenever the requirement becomes case-specific."]],
    documents: [["Business profile", ["Entity or owner details", "Business contact information", "Relevant registrations where applicable"]],["Supporting records", ["Agreements, statements or certificates", "Address or activity details", "Other service-specific documents"]]],
    process: [["01", "Define the business requirement"],["02", "Share the key details"],["03", "Review supporting records"],["04", "Prepare the service work"],["05", "Complete the relevant action"],["06", "Track the next business step"]],
    pricing: "Final pricing can reflect the service scope, complexity and professional effort. LAWXYGEN can publish approved pricing here.",
    faqs: [[`What is ${title}?`, `It is a LAWXYGEN business-support workflow for the requirement named on this page.`],["What information should I keep ready?", "Keep your core entity or owner details and the records that directly relate to the service."],["Can I get expert assistance?", "Yes. Use the expert CTA to move into the relevant professional workflow."],["Can related services be added?", "Yes. The page can connect the most relevant adjacent LAWXYGEN services."]],
    tutorial: `Use the expert tutorial to show how ${title} fits into the wider business journey and what users should prepare first.`,
    help: `Need a second opinion before starting ${title}? Talk to a LAWXYGEN expert and get the right route.`,
  }),
};

export function getServiceContent(title: string, category: string): ServiceContent {
  const key = serviceType(title, category);
  return generators[key](clean(title), category);
}
