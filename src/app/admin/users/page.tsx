import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='CLIENTS' title='Users' description='View client accounts, profiles and active legal work.'
    metrics={[
        { label: 'Registered', value: '1,284', note: 'All client accounts', icon: 'users' },
        { label: 'New this month', value: '82', note: 'Growing client base', icon: 'plus' },
        { label: 'Active matters', value: '376', note: 'Current workload', icon: 'requests' },
        { label: 'Verified', value: '97%', note: 'Contact verification', icon: 'check' }
    ]}
    rows={[
        { title: 'Aarav Sharma', subtitle: '3 active services · Delhi', meta: 'Joined 18 Jun', status: 'Active', tone: 'good' },
        { title: 'Nisha Jain', subtitle: '1 trademark matter · Mumbai', meta: 'Joined 2 Jul', status: 'Active', tone: 'good' },
        { title: 'Rohan Mehta', subtitle: 'GST + compliance · Jaipur', meta: 'Joined 19 Jul', status: 'Active', tone: 'good' },
        { title: 'Mira Kapoor', subtitle: 'Legal consultation · Bengaluru', meta: 'Joined 4 Aug', status: 'New', tone: 'neutral' }
    ]} />;
}
