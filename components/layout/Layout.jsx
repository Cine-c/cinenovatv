import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../CookieConsent';
import AdSlot from '../AdSlot';

export default function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <AdSlot />
      <Header />
      <main className="main-content">{children}</main>
      <Footer />

      {/* Floating N Logo */}
      <Link href="/" className="floating-logo" aria-label="Go to home">
        <span className="floating-n">N</span>
      </Link>

      <CookieConsent />
    </div>
  );
}
