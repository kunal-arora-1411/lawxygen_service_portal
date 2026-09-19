import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='COMPLIANCE HUB' title='Compliance calendar' description='Keep filings, renewals and recurring obligations visible.'
    metrics={[
        { label: 'Upcoming', value: '2', note: 'Next 30 days', icon: 'calendar' },
        { label: 'Due soon', value: '1', note: 'Within 7 days', icon: 'clock' },
        { label: 'Completed', value: '6', note: 'This financial year', icon: 'check' },
        { label: 'Overdue', value: '0', note: 'You are on track', icon: 'shield' }
    ]}
    rows={[
        { title: 'GSTR-3B filing', subtitle: 'July return period', meta: '23 Aug 2026', status: 'Upcoming', tone: 'warn' },
        { title: 'Director KYC', subtitle: 'Annual director KYC reminder', meta: '31 Aug 2026', status: 'Upcoming', tone: 'neutral' },
        { title: 'Trademark renewal watch', subtitle: 'Renewal monitoring enabled', meta: 'Continuous', status: 'Protected', tone: 'good' }
    ]} />;
}
