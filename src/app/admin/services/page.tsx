import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='CATALOGUE' title='Service catalogue' description='Manage LAWXYGEN’s complete service library and publishing status.'
    metrics={[
        { label: 'Service pages', value: '259', note: 'Published routes', icon: 'services' },
        { label: 'Categories', value: '10', note: 'Primary catalogue', icon: 'overview' },
        { label: 'Published', value: '259', note: 'No draft routes', icon: 'check' },
        { label: 'Broken links', value: '0', note: 'Catalogue healthy', icon: 'shield' }
    ]}
    rows={[
        { title: 'Business Setup', subtitle: '31 service pages', meta: 'Updated 12 Aug', status: 'Published', tone: 'good' },
        { title: 'Tax & Compliance', subtitle: '42 service pages', meta: 'Updated 15 Aug', status: 'Published', tone: 'good' },
        { title: 'Intellectual Property', subtitle: '28 service pages', meta: 'Updated 11 Aug', status: 'Published', tone: 'good' },
        { title: 'Documentation', subtitle: '36 service pages', meta: 'Updated 14 Aug', status: 'Published', tone: 'good' }
    ]} />;
}
