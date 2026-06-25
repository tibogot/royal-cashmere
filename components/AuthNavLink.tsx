"use client";

import { routes } from "@/lib/routes";
import Link from "next/link";
import { useEffect, useState } from "react";

type AuthNavLinkProps = {
  className: string;
};

type SessionResponse = {
  loggedIn: boolean;
  displayName?: string | null;
};

export default function AuthNavLink({ className }: AuthNavLinkProps) {
  const [session, setSession] = useState<SessionResponse>({ loggedIn: false });

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (cancelled) return;

        if (!response.ok) {
          setSession({ loggedIn: false });
          return;
        }

        const data = (await response.json()) as SessionResponse;
        setSession(data);
      } catch {
        if (!cancelled) {
          setSession({ loggedIn: false });
        }
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (session.loggedIn) {
    return (
      <Link href={routes.account} className={className}>
        {session.displayName ? `Bonjour, ${session.displayName}` : "Mon compte"}
      </Link>
    );
  }

  return (
    <Link href={routes.signIn} className={className}>
      Se connecter
    </Link>
  );
}
