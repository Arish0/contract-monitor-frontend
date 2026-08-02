"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <AuthGuard>
      {isLogin ? (
        <div className="flex-1 min-w-0">{children}</div>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </>
      )}
    </AuthGuard>
  );
}
