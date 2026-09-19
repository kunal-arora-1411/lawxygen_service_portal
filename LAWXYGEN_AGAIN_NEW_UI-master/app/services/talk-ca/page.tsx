import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Talk to a CA | LAWXYGEN",description:"Explore Talk to a CA services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="talk-ca"/>;}
