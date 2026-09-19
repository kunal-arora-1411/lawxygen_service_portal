import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Specialized Services | LAWXYGEN",description:"Explore Specialized Services services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="specialized-services"/>;}
