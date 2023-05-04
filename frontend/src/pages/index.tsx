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
      </Head>

      <main className={styles.main} style={{ textAlign: 'center' }}>
        <HomeContainer />

        <div className="text-center adsbygoogle my-3">
          <Adsense
            client="ca-pub-4238647462189874"
            slot="2052129219"
            style={{ display: 'block' }}
            layout="in-article"
            format="auto"
          />
        </div>
      </main>
    </>
  );
}
