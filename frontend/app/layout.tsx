import type { Metadata } from 'next';

import './globals.css';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'GameDev Каталог',
  description: 'Изпитен проект по ООП2 в ТУ-Варна за Каталог на разработчици на видео игри',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
