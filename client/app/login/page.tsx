"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/Button";

export default function LoginPage() {
      const router = useRouter();

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (isLoading) return;

            const trimmedEmail = email.trim();

            if (!trimmedEmail || !password) {
                  toast.error("Please fill in all fields.");
                  return;
            }

            if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
                  toast.error("Please enter a valid email.");
                  return;
            }

            try {
                  setIsLoading(true);

                  const { error } = await authClient.signIn.email({
                        email: trimmedEmail,
                        password,
                  });

                  if (error) {
                        toast.error(error.message);
                        return;
                  }

                  toast.success("Logged in successfully!");

                  router.push("/dashboard");
                  router.refresh();
            } catch (err) {
                  console.error(err);
                  toast.error("Something went wrong. Please try again.");
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
                  <div className="w-full max-w-xl border border-border bg-background p-8 shadow-[10px_10px_0px_var(--color-accent)]">
                        <h1 className="text-3xl font-semibold text-white">
                              Welcome back
                        </h1>

                        <p className="mt-2 text-white/60">
                              Sign in to continue managing your VPS.
                        </p>

                        <form
                              onSubmit={handleSubmit}
                              className="mt-8 space-y-5"
                        >
                              <div>
                                    <label
                                          htmlFor="email"
                                          className="mb-2 block text-sm text-white/80"
                                    >
                                          Email
                                    </label>

                                    <input
                                          id="email"
                                          type="email"
                                          autoComplete="email"
                                          placeholder="you@example.com"
                                          value={email}
                                          onChange={(e) =>
                                                setEmail(e.target.value)
                                          }
                                          disabled={isLoading}
                                          className="h-12 w-full border border-border bg-background px-4 text-white outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                              </div>

                              <div>
                                    <label
                                          htmlFor="password"
                                          className="mb-2 block text-sm text-white/80"
                                    >
                                          Password
                                    </label>

                                    <div className="relative">
                                          <input
                                                id="password"
                                                type={
                                                      showPassword
                                                            ? "text"
                                                            : "password"
                                                }
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) =>
                                                      setPassword(
                                                            e.target.value,
                                                      )
                                                }
                                                disabled={isLoading}
                                                className="h-12 w-full border border-border bg-background px-4 pr-12 text-white outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                                          />

                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setShowPassword(
                                                            (prev) => !prev,
                                                      )
                                                }
                                                disabled={isLoading}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white disabled:cursor-not-allowed"
                                          >
                                                {showPassword ? (
                                                      <EyeOff size={20} />
                                                ) : (
                                                      <Eye size={20} />
                                                )}
                                          </button>
                                    </div>
                              </div>

                              <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isLoading}
                                    className="w-full justify-center"
                              >
                                    {isLoading ? "Signing In..." : "Sign In"}
                              </Button>
                        </form>

                        <div className="mt-8 border-t border-border pt-6 text-center">
                              <p className="text-white/60">
                                    Don't have an account?{" "}
                                    <Link
                                          href="/register"
                                          className="font-medium text-accent hover:underline"
                                    >
                                          Create Account
                                    </Link>
                              </p>
                        </div>
                  </div>
            </main>
      );
}
