import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='CONSULTATIONS' title='Appointments' description='Coordinate consultations, availability and professional capacity.'
    metrics={[
        { label: 'Today', value: '27', note: 'All consultation types', icon: 'appointments' },
        { label: 'Upcoming', value: '7', note: 'Next 3 hours', icon: 'clock' },
        { label: 'Pending', value: '3', note: 'Needs confirmation', icon: 'activity' },
        { label: 'Professionals', value: '14', note: 'Available today', icon: 'professionals' }
    ]}
    rows={[
        { title: '11:30 AM · Corporate legal', subtitle: 'Mira Kapoor · Video consultation', meta: 'Today', status: 'Confirmed', tone: 'good' },
        { title: '12:15 PM · GST advisory', subtitle: 'Rohan Mehta · CA consultation', meta: 'Today', status: 'Confirmed', tone: 'good' },
        { title: '2:30 PM · Trademark review', subtitle: 'Nisha Jain · IP consultation', meta: 'Today', status: 'Pending confirm', tone: 'warn' },
        { title: '4:00 PM · Company structure', subtitle: 'Aarav Sharma · CS consultation', meta: 'Today', status: 'Confirmed', tone: 'good' }
    ]} />;
}
