import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='SUPPORT' title='Support queue' description='See client conversations and handoff requests that need attention.'
    metrics={[
        { label: 'Waiting', value: '5', note: 'Needs response', icon: 'support' },
        { label: 'In progress', value: '12', note: 'Assigned conversations', icon: 'messages' },
        { label: 'Resolved today', value: '38', note: 'Support throughput', icon: 'check' },
        { label: 'Avg response', value: '4m', note: 'Today', icon: 'clock' }
    ]}
    rows={[
        { title: 'SUP-10291 · Callback request', subtitle: 'Company registration · Hindi', meta: 'Waiting 8 min', status: 'Waiting', tone: 'warn' },
        { title: 'SUP-10289 · Document help', subtitle: 'Trademark authorisation', meta: 'Assigned', status: 'In progress', tone: 'neutral' },
        { title: 'SUP-10287 · Consultation change', subtitle: 'Reschedule video appointment', meta: 'Resolved 12 min ago', status: 'Resolved', tone: 'good' },
        { title: 'SUP-10285 · GST query', subtitle: 'Application status clarification', meta: 'Assigned', status: 'In progress', tone: 'neutral' }
    ]} />;
}
