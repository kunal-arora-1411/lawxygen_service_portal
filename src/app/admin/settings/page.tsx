import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='PLATFORM' title='Settings' description='Control operational preferences, permissions and platform configuration.'
    metrics={[
        { label: 'Admin roles', value: '4', note: 'Permission groups', icon: 'shield' },
        { label: 'Team members', value: '12', note: 'Operational access', icon: 'users' },
        { label: 'Alert channels', value: '3', note: 'Configured', icon: 'bell' },
        { label: 'Security checks', value: '100%', note: 'Current configuration', icon: 'check' }
    ]}
    rows={[
        { title: 'Workspace identity', subtitle: 'LAWXYGEN brand, contact details and legal name', meta: 'Configured', status: 'Active', tone: 'good' },
        { title: 'Notifications', subtitle: 'Email and operational alerts', meta: 'Enabled', status: 'Active', tone: 'good' },
        { title: 'Roles & permissions', subtitle: 'Admin and staff access policies', meta: 'Review quarterly', status: 'Configured', tone: 'neutral' },
        { title: 'Security', subtitle: 'Session and account controls', meta: 'Protected', status: 'Healthy', tone: 'good' }
    ]} />;
}
