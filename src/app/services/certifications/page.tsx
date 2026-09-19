import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Certifications | LAWXYGEN",description:"Explore Certifications services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="certifications"/>;}
