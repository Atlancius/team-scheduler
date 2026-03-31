import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Scheduler",
  description: "Gestion des emplois du temps d'équipe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
