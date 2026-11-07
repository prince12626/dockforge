"use client";
import logo from "../assets/logo.png";
import { Fragment, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    ...(session
      ? [{ name: "Dashboard", href: "/dashboard" }]
      : [{ name: "Login", href: "/login" }]),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="cursor-pointer text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            <Image src={logo} alt="DockForge" width={190} height={40} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:text-yellow"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            {!isPending &&
              (session ? (
                <Link href="/dashboard">
                  <Button className="bg-yellow text-black hover:bg-yellow/90">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button className="bg-yellow text-black hover:bg-yellow/90">
                    Create Account
                  </Button>
                </Link>
              ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-white transition hover:bg-white/10 lg:hidden"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                <DialogPanel className="flex h-full w-80 flex-col border-l border-white/10 bg-black p-6">
                  <div className="mb-10 flex items-center justify-between">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="text-2xl font-semibold text-white"
                    >
                      DockForge
                    </Link>

                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="rounded-md p-2 text-white hover:bg-white/10"
                    >
                      <X size={26} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-xl text-white/70 transition hover:text-yellow"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {!isPending &&
                    (session ? (
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <Button className="w-full bg-yellow text-black hover:bg-yellow/90">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full bg-yellow text-black hover:bg-yellow/90">
                          Create Account
                        </Button>
                      </Link>
                    ))}
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
