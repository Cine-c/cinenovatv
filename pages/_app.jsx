import Layout from '../components/layout/Layout';
import { OrganizationJsonLd } from '../components/seo/JsonLd';
import { WatchLaterProvider } from '../components/WatchLaterContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <WatchLaterProvider>
      <OrganizationJsonLd />
      {getLayout(<Component {...pageProps} />)}
    </WatchLaterProvider>
  );
}
