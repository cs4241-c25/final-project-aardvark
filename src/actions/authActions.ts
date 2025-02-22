// actions/auth.ts
"use server";
import { signIn } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/play" });
}

export async function signInWithTwitter() {
  await signIn("twitter", { redirectTo: "/play" });
}
