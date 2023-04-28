import styles from '@/styles/Home.module.css';
import Image from 'next/image';

export default function SearchBox({ funct } : { funct: any}) {
    return (
        <div className={styles.search_box}>
            <p>Searching for opponnent....</p>
            <div className={styles.spin_icone}>
                <Image src={`/images/spin.gif`} alt={"sping_loading"} width="100" height="100"/>
            </div>
            <button className={`${styles.stop_button} ${styles.mer}`} onClick={funct} >
                <p>Stop searching</p>
            </button>
        </div>
    );
}