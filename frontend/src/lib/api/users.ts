import { MOCK_USER } from "@/lib/mock-data";
import type { User } from "@/lib/types/domain";

export async function getCurrentUser(): Promise<User> {
  return MOCK_USER;
}
