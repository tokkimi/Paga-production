import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApplicationsClient from "./client";

export default async function ApplicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/" + locale);
  return <ApplicationsClient />;
}
