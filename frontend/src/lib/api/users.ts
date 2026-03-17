import { cookies } from "next/headers";
import type { User } from "@/lib/types/domain";

const USERS_API_URL =
  process.env.NEXT_PUBLIC_USERS_API_URL ?? process.env.USERS_API_URL ?? "http://localhost:8082";

const USERS_API_TOKEN = process.env.USERS_API_TOKEN;

async function fetchCurrentUser(token: string): Promise<User | null> {
  const response = await fetch(`${USERS_API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { user?: User };
  return payload.user ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("ita_auth_token")?.value;
  const token = cookieToken ?? USERS_API_TOKEN;

  if (!token) {
    return null;
  }

  try {
    return await fetchCurrentUser(token);
  } catch {
    return null;
  }
}
