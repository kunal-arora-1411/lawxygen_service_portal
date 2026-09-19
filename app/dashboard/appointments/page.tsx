import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='CONSULTATIONS' title='Appointments' description='Manage upcoming lawyer and expert consultations.'
    metrics={[
        { label: 'Upcoming', value: '2', note: 'Next 14 days', icon: 'appointments' },
        { label: 'Video call', value: '1', note: 'Browser consultation', icon: 'messages' },
        { label: 'Completed', value: '1', note: 'This month', icon: 'check' },
        { label: 'Missed', value: '0', note: 'No missed calls', icon: 'shield' }
    ]}
    rows={[
        { title: 'Corporate legal consultation', subtitle: 'Video consultation · 30 minutes', meta: '18 Aug · 11:30 AM', status: 'Confirmed', tone: 'good' },
        { title: 'GST advisory session', subtitle: 'CA consultation · 20 minutes', meta: '22 Aug · 4:00 PM', status: 'Scheduled', tone: 'neutral' },
        { title: 'Trademark review', subtitle: 'IP expert · document discussion', meta: '28 Aug · 2:30 PM', status: 'Scheduled', tone: 'neutral' }
    ]} />;
}
