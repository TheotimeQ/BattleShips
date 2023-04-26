import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Auth.module.css";
import LoginForm from "@/components/LoginForm";

export default function Login() {
    return (
        <>
        <Head>
            <title>Battleship - Connexion</title>
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
        <main className={styles.main}>
            <Image src="/images/logo.svg" alt="Battleship" width={200} height={200} className={styles.logo_top} />
            <LoginForm />
        </main>
        </>
    );
}
