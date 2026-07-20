"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith("/dashboard");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
