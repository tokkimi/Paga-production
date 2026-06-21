import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PartenariatsClient from "./client";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminPartenariatsPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}`);
  return <PartenariatsClient />;
}
