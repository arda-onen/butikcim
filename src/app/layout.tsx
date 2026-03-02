import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Butikcim | Trendy Butik",
  description:
    "Butikcim modern butik deneyimi: renkli tasarım, hızlı sipariş ve Easygo güvenli ödeme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
