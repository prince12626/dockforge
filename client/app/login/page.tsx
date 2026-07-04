"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function LoginPage() {
      const [showPassword, setShowPassword] = useState(false);

      return (
            <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
                  <div className="w-full max-w-xl border border-border bg-background p-8 shadow-[10px_10px_0px_var(--color-accent)]">
                        <h1 className="text-3xl font-semibold text-white">
                              Welcome back
                        </h1>

                        <p className="mt-2 text-white/60">
                              Sign in to continue managing your VPS.
                        </p>

                        <form className="mt-8 space-y-5">
                              <div>
                                    <label className="mb-2 block text-sm text-white/80">
                                          Email
                                    </label>

                                    <input
                                          type="email"
                                          placeholder="you@example.com"
                                          className="h-12 w-full border border-border bg-background px-4 text-white outline-none transition focus:border-accent"
                                    />
                              </div>

                              <div>
                                    <label className="mb-2 block text-sm text-white/80">
                                          Password
                                    </label>

                                    <div className="relative">
                                          <input
                                                type={
                                                      showPassword
                                                            ? "text"
                                                            : "password"
                                                }
                                                placeholder="••••••••"
                                                className="h-12 w-full border border-border bg-background px-4 pr-12 text-white outline-none transition focus:border-accent"
                                          />

                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setShowPassword(
                                                            !showPassword,
                                                      )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
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
                                    className="w-full justify-center"
                                    size="lg"
                              >
                                    Sign In
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
