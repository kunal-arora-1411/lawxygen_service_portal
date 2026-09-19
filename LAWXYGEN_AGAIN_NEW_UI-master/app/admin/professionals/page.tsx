import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='NETWORK' title='Professionals' description='Manage lawyers, CAs, CSs and specialist availability.'
    metrics={[
        { label: 'Professionals', value: '68', note: 'Verified network', icon: 'professionals' },
        { label: 'Online', value: '31', note: 'Available now', icon: 'activity' },
        { label: 'In call', value: '14', note: 'Currently occupied', icon: 'appointments' },
        { label: 'Offline', value: '23', note: 'Not accepting requests', icon: 'clock' }
    ]}
    rows={[
        { title: 'Corporate Legal Expert', subtitle: 'Corporate law · English, Hindi', meta: 'Available now', status: 'Online', tone: 'good' },
        { title: 'GST & Tax Expert', subtitle: 'Indirect tax · English, Hindi', meta: 'In consultation', status: 'Busy', tone: 'warn' },
        { title: 'IP Legal Expert', subtitle: 'Trademark & IP · English', meta: 'Available 2:30 PM', status: 'Available', tone: 'good' },
        { title: 'Company Secretary', subtitle: 'ROC & secretarial compliance', meta: 'Offline', status: 'Offline', tone: 'neutral' }
    ]} />;
}
