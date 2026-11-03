import Script from 'next/script';
import { site } from '@/config/site';

// Google Tag Manager and Meta Pixel. Each loads only when its ID is set (in
// src/config/site.ts, or through the matching NEXT_PUBLIC_ environment variable),
// so this renders nothing until the company provides the accounts. Google
// Analytics keeps its own component. Google Ads conversions are normally set up
// inside Tag Manager from the `generate_lead` event this site already sends.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || site.gtmId;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || site.metaPixelId;

export default function Tracking() {
  return (
    <>
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src='https://connect.facebook.net/en_US/fbevents.js';s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
