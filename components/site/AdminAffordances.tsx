"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Loader only. Asks the server whether the current session is an admin;
 * for visitors this renders nothing AND never downloads the toolbar code
 * (it lives in a separate chunk imported only after an admin is confirmed).
 * Decorative only — real auth is enforced server-side (RLS + requireAdmin).
 */
export function AdminAffordances() {
  const [Toolbar, setToolbar] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { isAdmin: false }))
      .then(async (d) => {
        if (!alive || !d.isAdmin) return;
        const mod = await import("./AdminToolbar");
        if (alive) setToolbar(() => mod.default);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return Toolbar ? <Toolbar /> : null;
}
