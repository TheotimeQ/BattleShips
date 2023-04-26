import { useState } from 'react';

import styles from '@/styles/Form.module.css';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function RegisterForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const register = () => {
        setLoading(true);

        service.register(username, password).then((response) => {
            if(response.success) {
                window.location.href = '/';
            } else {
                alert(response.message);
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className={styles.form_container}>
            <h1 className={styles.form_title}>Créer un compte</h1>

            <label htmlFor="username" className={styles.form_label}>Nom d'utilisateur</label>
            <input type="text" placeholder="Nom d'utilisateur" className={styles.form_input} value={username} onChange={(e) => {
                setUsername(e.target.value);
            }} />

            <label htmlFor="password" className={styles.form_label}>Mot de passe</label>
            <input type="password" placeholder="Mot de passe" className={styles.form_input} value={password} onChange={(e) => {
                setPassword(e.target.value);
            }} />

            <button type="submit" className={styles.form_button} onClick={register} disabled={loading}>{loading ? 'Inscription en cours...' : 'Créer un compte'}</button>

            <p className={styles.form_text}>Vous avez déjà un compte ? <a href="/login" className={styles.form_link}>Connectez-vous</a></p>
        </div>
    );
}