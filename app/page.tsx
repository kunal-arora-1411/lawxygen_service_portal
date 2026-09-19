import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * The portal has no landing page of its own — lawxygen.in is the front door. Anyone
 * arriving at the root either has a session or needs one.
 */
export default async function RootPage() {
  redirect((await currentUser()) ? "/dashboard" : "/login");
}
