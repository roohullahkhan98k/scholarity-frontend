import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Scholarity - Unlock Your Potential',
  description: 'Connect with expert tutors and learn any subject.',
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
