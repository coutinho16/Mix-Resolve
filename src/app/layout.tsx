import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { FaixaDemo } from "@/components/shared/FaixaDemo";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Central Mix",
  description: "Sistema de gestão da Mix Resolve",
};

const TEMA_SCRIPT = `
(function () {
  try {
    var tema = localStorage.getItem("tema");
    if (tema === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEMA_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-branco text-preto">
        <FaixaDemo />
        {children}
      </body>
    </html>
  );
}
