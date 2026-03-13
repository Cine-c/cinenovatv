import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../CookieConsent';

const CustomCursor = dynamic(() => import('../CustomCursor'), { ssr: false });

export default function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />

      <div className="film-grain" />
      <CustomCursor />

      <CookieConsent />
    </div>
  );
}
