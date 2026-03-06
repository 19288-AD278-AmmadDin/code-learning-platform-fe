import type { Metadata } from "next";
import { Dela_Gothic_One, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";

const delaGothic = Dela_Gothic_One({ weight: "400", variable: "--font-dela", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeSavvy — Master the Art of Code",
  description:
    "The premium learning platform for AI, Web3, cybersecurity, and beyond. Learn from industry veterans and build the career of your dreams.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("codesavvy-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`,
          }}
        />
      </head>
      <body
        className={`${delaGothic.variable} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
