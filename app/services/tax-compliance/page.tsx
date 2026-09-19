import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Tax & Compliance | LAWXYGEN",description:"Explore Tax & Compliance services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="tax-compliance"/>;}
