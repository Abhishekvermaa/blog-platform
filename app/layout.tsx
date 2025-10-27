/*import Provider from "./_trpc/Provider";
import Navigation from "../components/Navigation";  
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "Full-stack blog platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Navigation />  
          {children}
        </Provider>
      </body>
    </html>
  );
}*/
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "./_trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "Full-stack blog platform with Next.js and tRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}