import Provider from "./_trpc/Provider";
import Navigation from "../components/Navigation";  // ADD THIS
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
          <Navigation />  {/* ADD THIS */}
          {children}
        </Provider>
      </body>
    </html>
  );
}