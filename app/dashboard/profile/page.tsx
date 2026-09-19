import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='ACCOUNT' title='Profile & preferences' description='Manage contact details, business information and account security.'
    metrics={[
        { label: 'Profile complete', value: '92%', note: '2 fields remaining', icon: 'profile' },
        { label: 'Business', value: '1', note: 'Primary workspace', icon: 'services' },
        { label: 'Sign-in methods', value: '2', note: 'Email + Google', icon: 'shield' },
        { label: 'Preferences', value: '3', note: 'Notifications enabled', icon: 'settings' }
    ]}
    rows={[
        { title: 'Personal information', subtitle: 'Name, mobile number and email', meta: 'Last updated 12 Aug', status: 'Complete', tone: 'good' },
        { title: 'Business profile', subtitle: 'Company and business information', meta: '2 fields incomplete', status: 'Review', tone: 'warn' },
        { title: 'Communication preferences', subtitle: 'Email and in-app notifications', meta: 'Configured', status: 'Active', tone: 'good' },
        { title: 'Security', subtitle: 'Password and sign-in methods', meta: 'Last checked today', status: 'Protected', tone: 'good' }
    ]} />;
}
