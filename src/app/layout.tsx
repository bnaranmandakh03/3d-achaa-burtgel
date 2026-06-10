import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ачааны бүртгэл',
  description: '3D принтерийн захиалгын хяналт',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={montserrat.variable}>
      <body className="font-sans bg-white text-[#14211F]">{children}</body>
    </html>
  );
}
