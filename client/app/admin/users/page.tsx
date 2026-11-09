import type { Metadata } from "next";
import UsersManagement from "./users-management";

export const metadata: Metadata = {
  title: "Users | Dockforge Admin",
};

export default function Page() {
  return <UsersManagement />;
}
