import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Business Setup | LAWXYGEN",description:"Explore Business Setup services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="business-setup"/>;}
