import { useParams } from "react-router-dom";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";

// Generic fallback for any category — including ones created dynamically via
// the admin catalogue — so a new category never needs a hand-written page
// file the way business-setup/tax-compliance/etc. currently do. This route
// is registered as "/services/:categorySlug" (2 segments), so react-router
// still prefers a more specific literal route (e.g. "/services/tax-compliance")
// when both exist; it only kicks in when no literal file matches.
export default function Page() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  if (!categorySlug) return null;
  return <ServiceCategoryPage slug={categorySlug} />;
}
