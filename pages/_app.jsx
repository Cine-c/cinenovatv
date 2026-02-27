import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { OrganizationJsonLd } from '../components/seo/JsonLd';
import { WatchLaterProvider } from '../components/WatchLaterContext';
import { AdFreeProvider } from '../components/AdFreeContext';
import '../styles/globals.css';

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
    <AdFreeProvider>
      <WatchLaterProvider>
        <OrganizationJsonLd />
        {getLayout(<Component {...pageProps} />)}
      </WatchLaterProvider>
    </AdFreeProvider>
  );
}
