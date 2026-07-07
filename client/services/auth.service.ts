import { User } from "@/types/auth.type";

export async function login(): Promise<User> {
      // TODO: Better Auth login
      throw new Error("Not implemented");
}

export async function getCurrentUser(): Promise<User | null> {
      // TODO: Better Auth session
      return null;
}

export async function logout(): Promise<void> {
      // TODO: Better Auth logout
}
