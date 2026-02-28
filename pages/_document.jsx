import { Html, Head, Main, NextScript } from 'next/document';

const GA_ID = 'G-81S7GHHRSB';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* Google consent mode defaults — must run before gtag loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied'
});`,
          }}
        />
        {/* Global site tag (gtag.js) — loads early, respects consent mode */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
gtag('js',new Date());
gtag('config','${GA_ID}',{send_page_view:false});`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
      </Head>
      <body>
        {/* Kill AdSense Auto Ads (vignettes, anchors, overlays) via CSS.
            Our manual ads live inside .ad-container — anything outside is auto-injected. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
ins.adsbygoogle:not(.ad-container ins){display:none!important;height:0!important;max-height:0!important;overflow:hidden!important;visibility:hidden!important}
body>div[style*="position: fixed"],body>div[style*="position:fixed"]{display:none!important}
div[id^="google_ads_iframe"]:not(.ad-container div){display:none!important}
iframe[id^="aswift_"]:not(.ad-container iframe){display:none!important}
`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
