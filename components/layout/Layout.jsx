import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import AdSlot from '../AdSlot';
import CookieConsent from '../CookieConsent';

export default function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <Header />
      <AdSlot />
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
