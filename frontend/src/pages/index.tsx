import Head from 'next/head';

import HomeContainer from '@/components/HomeContainer';

import styles from '@/styles/Home.module.css';

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
      </main>
    </>
  );
}
