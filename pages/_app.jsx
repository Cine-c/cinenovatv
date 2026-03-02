import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/layout/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import { OrganizationJsonLd } from '../components/seo/JsonLd';
import { WatchLaterProvider } from '../components/WatchLaterContext';
import '../styles/globals.css';

const AuthProvider = dynamic(
  () => import('../components/AuthContext').then((mod) => mod.AuthProvider),
  { ssr: false }
);

const AdFreeProvider = dynamic(
  () => import('../components/AdFreeContext').then((mod) => mod.AdFreeProvider),
  { ssr: false }
);

const GA_ID = 'G-81S7GHHRSB';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  useEffect(() => {
    // Send initial page view
    window.gtag?.('event', 'page_view', {
      page_path: window.location.pathname,
    });

    // Track client-side navigations
    const handleRouteChange = (url) => {
      window.gtag?.('event', 'page_view', { page_path: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdFreeProvider>
          <WatchLaterProvider>
            <OrganizationJsonLd />
            {getLayout(<Component {...pageProps} />)}
          </WatchLaterProvider>
        </AdFreeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
