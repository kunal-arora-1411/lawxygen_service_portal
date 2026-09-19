import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Documentation | LAWXYGEN",description:"Explore Documentation services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="documentation"/>;}
