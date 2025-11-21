import type { Metadata } from 'next';

import './globals.css';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'TU Varna GameDev Catalogue',
  description: 'A catalogue of game development projects from TU Varna',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
