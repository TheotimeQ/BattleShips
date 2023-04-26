import Head from 'next/head';
import Image from 'next/image';
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
        <Image src="/images/logo.svg" alt="Battleship" width={200} height={200} />
      </main>
    </>
  );
}
