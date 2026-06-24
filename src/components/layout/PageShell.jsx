"use client";

import PageTransition from "@/components/ui/PageTransition";

export default function PageShell({ children, className = "flex-1" }) {
  return <PageTransition className={className}>{children}</PageTransition>;
}
