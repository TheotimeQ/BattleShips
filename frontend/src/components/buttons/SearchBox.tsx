import styles from '@/styles/Home.module.css';
import Image from 'next/image';

export default function SearchBox({ funct } : { funct: any}) {
    return (
        <div className={styles.search_box}>
            <p>Recherche d'un adversaire....</p>
            <div className={styles.spin_icone}>
                <Image src={`/images/spin.gif`} alt={"sping_loading"} width="100" height="100"/>
            </div>
            <button className={`${styles.stop_button} ${styles.mer}`} onClick={funct} >
                Stopper la recherche
            </button>
        </div>
    );
}