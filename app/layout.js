import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/ui/google-analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ميجو نتيجة",
  description: "بحث عن نتيجة 2024 بالاسم أو رقم الجلوس",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <GoogleAnalytics />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
