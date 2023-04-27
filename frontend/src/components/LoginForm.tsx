import { useState } from 'react';
import router from 'next/router';

import styles from '@/styles/Form.module.css';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const login = () => {
        setLoading(true);

        service.login(username, password).then((response) => {
            if(response.success) {
                router.push(`/`);
            } else {
                alert(response.message);
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className={styles.form_container}>
            <h1 className={styles.form_title}>Connexion</h1>

            <label htmlFor="username" className={styles.form_label}>Nom d'utilisateur</label>
            <input type="text" placeholder="Nom d'utilisateur" className={styles.form_input} value={username} onChange={(e) => {
                setUsername(e.target.value);
            }} />

            <label htmlFor="password" className={styles.form_label}>Mot de passe</label>
            <input type="password" placeholder="Mot de passe" className={styles.form_input} value={password} onChange={(e) => {
                setPassword(e.target.value);
            }} />

            <button type="submit" className={styles.form_button} onClick={login} disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>

            <p className={styles.form_text}>Vous n'avez pas de compte ? <a href="/register" className={styles.form_link}>Inscrivez-vous</a></p>
        </div>
    );
}