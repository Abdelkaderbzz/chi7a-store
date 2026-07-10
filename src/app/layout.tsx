import type { Metadata } from "next";
import "./globals.css";
import { STORE_INFO } from "@/lib/constants";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: `${STORE_INFO.name} — ${STORE_INFO.location}`,
    template: `%s | ${STORE_INFO.name}`,
  },
  description: STORE_INFO.welcome,
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400..700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-cairo: 'Cairo', sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors dir="rtl" toastOptions={{ className: "font-sans text-[15px]" }} />
      </body>
    </html>
  );
}
