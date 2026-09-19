import { PortalSectionPage } from "@/components/portal/PortalSectionPage";

export default function Page() {
  return <PortalSectionPage eyebrow='COMMUNICATIONS' title='Messages' description='Keep service conversations and professional updates in one place.'
    metrics={[
        { label: 'Unread', value: '4', note: 'Across active matters', icon: 'messages' },
        { label: 'Conversations', value: '3', note: 'Active threads', icon: 'support' },
        { label: 'Experts', value: '2', note: 'Currently assigned', icon: 'professionals' },
        { label: 'Update today', value: '1', note: 'Latest activity', icon: 'activity' }
    ]}
    rows={[
        { title: 'Company Registration Team', subtitle: 'Documents have been reviewed. One clarification is required.', meta: '5h ago', status: 'Unread', tone: 'warn' },
        { title: 'Trademark Expert', subtitle: 'Please upload the signed authorisation form.', meta: 'Yesterday', status: 'Unread', tone: 'warn' },
        { title: 'GST Team', subtitle: 'Your ARN has been generated successfully.', meta: 'Yesterday', status: 'Read', tone: 'good' }
    ]} />;
}
