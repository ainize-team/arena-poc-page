import '../styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Google Analytics 페이지 변경 추적
    const handleRouteChange = (url) => {
      window.gtag('config', 'G-WHKH2Q8EJY', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
      <Head>
        <script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-WHKH2Q8EJY">
        </script>
        <script
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WHKH2Q8EJY');
          `}}
        />
      </Head>
  )
}