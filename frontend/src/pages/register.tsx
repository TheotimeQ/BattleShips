import Head from "next/head";

import styles from "@/styles/Login.module.css";
import RegisterForm from "@/components/RegisterForm";

export default function Login() {
    return (
        <>
        <Head>
            <title>Battleship - Inscription</title>
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
            <RegisterForm />
        </main>
        </>
    );
}