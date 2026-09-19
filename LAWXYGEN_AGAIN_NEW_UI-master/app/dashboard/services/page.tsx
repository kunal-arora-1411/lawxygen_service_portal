import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='MY SERVICES' title='My services' description='Track every LAWXYGEN service from intake to completion.'
    metrics={[
        { label: 'Active services', value: '3', note: '1 needs attention', icon: 'services' },
        { label: 'Needs action', value: '1', note: 'Upload requested', icon: 'activity' },
        { label: 'Steps completed', value: '7', note: 'Across active matters', icon: 'check' },
        { label: 'Experts assigned', value: '2', note: 'LAWXYGEN team', icon: 'professionals' }
    ]}
    rows={[
        { title: 'Private Limited Company Registration', subtitle: 'Application review · 7/10 steps complete', meta: 'Updated 2h ago', status: 'In progress', tone: 'neutral' },
        { title: 'Trademark Registration', subtitle: 'Authorisation document requested', meta: 'Due 20 Aug', status: 'Action needed', tone: 'warn' },
        { title: 'GST Registration', subtitle: 'Application filed successfully', meta: 'ARN generated', status: 'Under review', tone: 'good' }
    ]} primaryLabel='Explore services' primaryHref='/services' />;
}
