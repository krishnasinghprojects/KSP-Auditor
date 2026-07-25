import { Young_Serif, Lora } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  variable: "--font-young-serif",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata = {
  title: "KSP Auditor | SEO Audit Tool",
  description: "A sleek tool to audit any URL and generate SEO metrics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${youngSerif.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
