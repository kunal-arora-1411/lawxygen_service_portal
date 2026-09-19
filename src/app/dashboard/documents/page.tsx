import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='SECURE VAULT' title='Documents' description='Store, review and access files linked to your legal matters.'
    metrics={[
        { label: 'Documents', value: '12', note: 'Across your matters', icon: 'documents' },
        { label: 'Verified', value: '9', note: 'Ready for processing', icon: 'check' },
        { label: 'In review', value: '2', note: 'Team verification', icon: 'clock' },
        { label: 'Action needed', value: '1', note: 'Signature required', icon: 'activity' }
    ]}
    rows={[
        { title: 'PAN Card.pdf', subtitle: 'Private Limited Company Registration', meta: 'Verified', status: 'Verified', tone: 'good' },
        { title: 'Address Proof.pdf', subtitle: 'Private Limited Company Registration', meta: 'Uploaded 2h ago', status: 'Under review', tone: 'neutral' },
        { title: 'Trademark Authorisation.pdf', subtitle: 'Trademark Registration', meta: 'Signature required', status: 'Action needed', tone: 'warn' },
        { title: 'GST Acknowledgement.pdf', subtitle: 'GST Registration', meta: 'Generated yesterday', status: 'Ready', tone: 'good' }
    ]} />;
}
