import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div className={`app-sky-page motion-safe:animate-[fade-slide_.35s_ease-out] ${className}`}>
      {children}
    </div>
  );
}
