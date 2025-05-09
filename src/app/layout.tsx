import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tailwind and custom global styles
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import AppStateProvider from '@/context/AppStateProvider'; // To be created for managing global state

// Prevent Font Awesome from adding its CSS since we did it manually
fontAwesomeConfig.autoAddCss = false;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'local-hub-nextjs',
  description: 'Local Hub - Your City Marketplace, built with Next.js and TypeScript',
  // viewport: 'width=device-width, initial-scale=1.0', // Next.js handles this by default
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-gray-100 font-sans"> {/* Use inter variable for font */}
        <AppStateProvider>
          <div className="mx-auto bg-white min-h-screen flex flex-col shadow-lg">
            {children}
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
