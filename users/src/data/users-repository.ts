import type { User, UserRole } from "../types/user";
import { convexClient } from "./convex-client";

interface StoredUser extends User {
  passwordHash?: string;
}

function sanitizeUser(user: StoredUser | null): User | null {
  if (!user) {
    return null;
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(input: {
  name: string;
  email: string;
  city: string;
  role: UserRole;
  avatarInitials: string;
  passwordHash: string;
}): Promise<User> {
  const user = await (convexClient as any).mutation("users:registerUser", input);
  return sanitizeUser(user as StoredUser)!;
}

export async function getUserByEmailWithPassword(email: string): Promise<StoredUser | null> {
  const user = await (convexClient as any).query("users:getUserByEmailWithPassword", { email });
  return (user as StoredUser | null) ?? null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await (convexClient as any).query("users:getUserById", { userId });
  return sanitizeUser((user as StoredUser | null) ?? null);
}

export async function updateUserById(
  userId: string,
  patch: Partial<Pick<User, "name" | "city" | "role" | "avatarInitials">>,
): Promise<User | null> {
  const user = await (convexClient as any).mutation("users:updateUserProfile", {
    userId,
    patch,
  });

  return sanitizeUser((user as StoredUser | null) ?? null);
}
