import { Inter } from "next/font/google";
import { type ReactElement } from "react";
import { Navbar } from "./Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Navbar />
      <main className={`font-sans ${inter.variable}`}>{children}</main>
    </>
  );
}
