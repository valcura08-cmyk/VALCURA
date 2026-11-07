import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VALCURA | A Scent for Every Side of You',
  description:
    'VALCURA is a modern fragrance house built around individuality, moods and personal expression. Discover the Cacao Collection and our flagship fragrance, Cacao Citrine.',
  icons: {
    icon: '/brand/valcura-emblem-dark.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF7F2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Official Google Identity Services SDK for Real One-Tap & Google Login */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="bg-white text-[#110D09] min-h-screen flex flex-col font-sans antialiased selection:bg-[#110D09] selection:text-[#FAF7F2] overflow-x-hidden w-full max-w-full">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <AuthModal />
            <main className="flex-1 pt-16 sm:pt-20 overflow-x-hidden w-full max-w-full">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
