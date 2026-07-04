"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      return (
            <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
                  <div className="w-full max-w-xl border border-border bg-background p-8 shadow-[10px_10px_0px_var(--color-accent)]">
                        {/* Heading */}
                        <h1 className="text-3xl font-semibold text-white">
                              Create your account
                        </h1>

                        <p className="mt-2 text-white/60">
                              Start managing your VPS infrastructure in minutes.
                        </p>

                        <form className="mt-8 space-y-5">
                              {/* Name */}
                              <div>
                                    <label className="mb-2 block text-sm font-medium text-white/80">
                                          Full Name
                                    </label>

                                    <input
                                          type="text"
                                          placeholder="John Doe"
                                          className="h-12 w-full border border-border bg-background px-4 text-white outline-none transition-all focus:border-accent"
                                    />
                              </div>

                              {/* Email */}
                              <div>
                                    <label className="mb-2 block text-sm font-medium text-white/80">
                                          Email
                                    </label>

                                    <input
                                          type="email"
                                          placeholder="you@example.com"
                                          className="h-12 w-full border border-border bg-background px-4 text-white outline-none transition-all focus:border-accent"
                                    />
                              </div>

                              {/* Password */}
                              <div>
                                    <label className="mb-2 block text-sm font-medium text-white/80">
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
                                                className="h-12 w-full border border-border bg-background px-4 pr-12 text-white outline-none transition-all focus:border-accent"
                                          />

                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setShowPassword(
                                                            (prev) => !prev,
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

                              {/* Confirm Password */}
                              <div>
                                    <label className="mb-2 block text-sm font-medium text-white/80">
                                          Confirm Password
                                    </label>

                                    <div className="relative">
                                          <input
                                                type={
                                                      showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                }
                                                placeholder="••••••••"
                                                className="h-12 w-full border border-border bg-background px-4 pr-12 text-white outline-none transition-all focus:border-accent"
                                          />

                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setShowConfirmPassword(
                                                            (prev) => !prev,
                                                      )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                                          >
                                                {showConfirmPassword ? (
                                                      <EyeOff size={20} />
                                                ) : (
                                                      <Eye size={20} />
                                                )}
                                          </button>
                                    </div>
                              </div>

                              {/* Submit */}
                              <Button
                                    className="mt-2 w-full justify-center"
                                    size="lg"
                              >
                                    Create Account
                              </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 border-t border-border pt-6 text-center">
                              <p className="text-white/60">
                                    Already have an account?{" "}
                                    <Link
                                          href="/login"
                                          className="font-medium text-accent transition hover:underline"
                                    >
                                          Sign In
                                    </Link>
                              </p>
                        </div>
                  </div>
            </main>
      );
}
