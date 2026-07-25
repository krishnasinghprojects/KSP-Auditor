import Auditor from '../components/Auditor';

export default function SharedAudit({ params }) {
  // Pass the base64 encoded URL parameter directly to the Auditor component
  return <Auditor initialSlug={params.slug} />;
}
