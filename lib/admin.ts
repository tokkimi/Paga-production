import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN" ? session : null;
}

