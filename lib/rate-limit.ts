import "server-only";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

type RateLimitResult = { allowed: boolean; retryAfter: number };

export async function checkRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const fingerprint = forwarded
    || request.headers.get("x-real-ip")
    || `${request.headers.get("user-agent") || "unknown"}:${request.headers.get("accept-language") || ""}`;
  return checkRateLimitIdentity(scope, fingerprint, limit, windowMs);
}

export async function checkRateLimitIdentity(
  scope: string,
  identityValue: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const salt = process.env.NEXTAUTH_SECRET || "local-development-rate-limit";
  const identity = createHmac("sha256", salt).update(identityValue).digest("hex").slice(0, 24);
  const key = `${scope}:${bucket}:${identity}`;
  const expiresAt = new Date((bucket + 1) * windowMs);

  const record = await prisma.rateLimitBucket.upsert({
    where: { key },
    create: { key, expiresAt, count: 1 },
    update: { count: { increment: 1 } },
    select: { count: true },
  });

  if (Math.random() < 0.02) {
    void prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date(now - windowMs) } } }).catch(() => undefined);
  }

  return {
    allowed: record.count <= limit,
    retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}
