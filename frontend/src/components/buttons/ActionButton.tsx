import Image from 'next/image';

import styles from '@/styles/Home.module.css';

export default function ActionButton({ text }: { text: string }) {
    return (
        <div className={styles.action_button}>
            <p>{text}</p>
        </div>
    );
}