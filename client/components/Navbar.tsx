"use client";     
import { Fragment } from "react";
import {
      Dialog,
      DialogPanel,
      Transition,
      TransitionChild,
} from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

const links = [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Login", href: "/login" },
];

const Navbar = () => {
      const [open, setOpen] = useState(false);

      return (
            <>
                  <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
                        <div className="mx-auto flex h-18 items-center justify-between px-5 sm:px-8 lg:px-12">
                              <h1 className="cursor-pointer text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    DockForge
                              </h1>

                              <nav className="hidden items-center gap-8 lg:flex">
                                    {links.map((link) => (
                                          <a
                                                key={link.name}
                                                href={link.href}
                                                className="text-lg text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:text-white"
                                          >
                                                {link.name}
                                          </a>
                                    ))}
                              </nav>

                              <div className="hidden lg:block">
                                    <Button>Create Account</Button>
                              </div>

                              <button
                                    onClick={() => setOpen(true)}
                                    className="rounded-md p-2 text-white transition hover:bg-white/5 lg:hidden"
                              >
                                    <Menu size={28} />
                              </button>
                        </div>
                  </header>

                  <Transition show={open} as={Fragment}>
                        <Dialog
                              as="div"
                              className="relative z-100"
                              onClose={setOpen}
                        >
                              <TransitionChild
                                    as={Fragment}
                                    enter="transition-opacity duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                              >
                                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                              </TransitionChild>

                              <div className="fixed inset-0 overflow-hidden">
                                    <div className="absolute inset-0 flex justify-end">
                                          <TransitionChild
                                                as={Fragment}
                                                enter="transform transition duration-300"
                                                enterFrom="translate-x-full"
                                                enterTo="translate-x-0"
                                                leave="transform transition duration-200"
                                                leaveFrom="translate-x-0"
                                                leaveTo="translate-x-full"
                                          >
                                                <DialogPanel className="flex h-full w-80 flex-col border-l border-border bg-background p-6">
                                                      <div className="mb-10 flex items-center justify-between">
                                                            <h2 className="text-2xl font-semibold text-white">
                                                                  DockForge
                                                            </h2>

                                                            <button
                                                                  onClick={() =>
                                                                        setOpen(
                                                                              false,
                                                                        )
                                                                  }
                                                                  className="rounded-md p-2 text-white hover:bg-white/5"
                                                            >
                                                                  <X
                                                                        size={
                                                                              26
                                                                        }
                                                                  />
                                                            </button>
                                                      </div>

                                                      <div className="flex flex-1 flex-col gap-6">
                                                            {links.map(
                                                                  (link) => (
                                                                        <a
                                                                              key={
                                                                                    link.name
                                                                              }
                                                                              href={
                                                                                    link.href
                                                                              }
                                                                              onClick={() =>
                                                                                    setOpen(
                                                                                          false,
                                                                                    )
                                                                              }
                                                                              className="text-xl text-white/70 transition hover:text-white"
                                                                        >
                                                                              {
                                                                                    link.name
                                                                              }
                                                                        </a>
                                                                  ),
                                                            )}
                                                      </div>

                                                      <Button>
                                                            Create Account
                                                      </Button>
                                                </DialogPanel>
                                          </TransitionChild>
                                    </div>
                              </div>
                        </Dialog>
                  </Transition>
            </>
      );
};

export default Navbar;
