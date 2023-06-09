import styles from '@/styles/Home.module.css';
import Image from 'next/image';

export default function HomeButton({ text, onClick, img}: { text: string, onClick: any, img: string }) {
    return (
        <button className={styles.home_button} onClick={onClick}>
            <div className={styles.button_icone}>
                <Image src={`/images/${img}.png`} alt={text} width="100" height="100"/>
            </div>
            <p>{text}</p>
        </button>);
}