import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
export const metadata: Metadata={title:"Talk to a Lawyer | LAWXYGEN",description:"Explore Talk to a Lawyer services on LAWXYGEN."};
export default function Page(){return <ServiceCategoryPage slug="talk-lawyer"/>;}
