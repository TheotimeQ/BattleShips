import styles from '@/styles/Form.module.css';

export default function RegisterForm() {
    return (
        <div className={styles.form_container}>
            <h1 className={styles.form_title}>Inscription</h1>

            <label htmlFor="username" className={styles.form_label}>Nom d'utilisateur</label>
            <input type="text" placeholder="Nom d'utilisateur" className={styles.form_input} />

            <label htmlFor="password" className={styles.form_label}>Mot de passe</label>
            <input type="password" placeholder="Mot de passe" className={styles.form_input} />

            <button type="submit" className={styles.form_button}>Créer un compte</button>

            <p className={styles.form_text}>Vous avez déjà un compte ? <a href="/login" className={styles.form_link}>Connectez-vous</a></p>
        </div>
    );
}