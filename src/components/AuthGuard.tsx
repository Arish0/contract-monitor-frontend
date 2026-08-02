"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, isSessionValid, clearSession } from "@/lib/session";

const CHECK_INTERVAL_MS = 30_000;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }

    const check = (): boolean => {
      const session = getSession();
      if (!isSessionValid(session)) {
        clearSession();
        router.replace("/login");
        return false;
      }
      return true;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(check());

    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
