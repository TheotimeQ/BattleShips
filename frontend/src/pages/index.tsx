import Head from 'next/head';
import {Adsense} from '@ctrl/react-adsense';

import HomeContainer from '@/components/HomeContainer';

import styles from '@/styles/Home.module.css';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Head>
        <title>Battleship</title>
        <meta
          name="description"
          content="Jeu de bataille navale multijoueur"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
        <Script
          id="Adsense-id"
          data-ad-client="ca-pub-4238647462189874"
          async={true}
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
      </Head>

      <main className={styles.main} style={{ textAlign: 'center' }}>
        <HomeContainer />
      </main>

      <Adsense
        client="ca-pub-4238647462189874"
        slot="7259870550"
      />

      <Adsense
        client="ca-pub-4238647462189874"
        slot="7259870550"
        style={{ display: 'block' }}
        layout="in-article"
        format="fluid"
      />
    </>
  );
}
