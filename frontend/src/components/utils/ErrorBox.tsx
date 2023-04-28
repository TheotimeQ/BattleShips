import styles from '@/styles/Utils.module.css';

export default function HomeButton({ text}: { text: string}) {
    return (
        <div className={styles.error_box}>
            <p>{text}</p>
        </div>
    );
}