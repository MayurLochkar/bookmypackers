import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'HackOcean Leads | Enterprise Distribution',
  description: 'High-performance real-time lead allocation engine.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-teal-50">
        <Navbar />
        <main className="flex-grow pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
