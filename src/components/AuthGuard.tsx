"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { isLoggedIn } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) setOk(true);
    else router.replace("/");
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
