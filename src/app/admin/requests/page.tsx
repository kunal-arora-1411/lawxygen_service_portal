import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='OPERATIONS' title='Service requests' description='Assign, review and move client requests through delivery.'
    metrics={[
        { label: 'Active', value: '146', note: 'Across all services', icon: 'requests' },
        { label: 'Unassigned', value: '18', note: 'Needs owner', icon: 'activity' },
        { label: 'Due today', value: '27', note: 'Operational queue', icon: 'clock' },
        { label: 'Within SLA', value: '91%', note: 'Last 7 days', icon: 'check' }
    ]}
    rows={[
        { title: 'LX-48291 · Private Limited Company', subtitle: 'Aarav Sharma · documents received', meta: '12 min ago', status: 'Docs review', tone: 'neutral' },
        { title: 'LX-48290 · Trademark Registration', subtitle: 'Nisha Jain · signature pending', meta: '24 min ago', status: 'Action needed', tone: 'warn' },
        { title: 'LX-48288 · GST Registration', subtitle: 'Rohan Mehta · expert assigned', meta: '41 min ago', status: 'Assigned', tone: 'good' },
        { title: 'LX-48284 · Lawyer Consultation', subtitle: 'Mira Kapoor · video booked', meta: '1 hr ago', status: 'Booked', tone: 'good' }
    ]} />;
}
