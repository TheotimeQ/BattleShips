import styles from '@/styles/Home.module.css';

export default function SearchBox({ funct } : { funct: any }) {
    return (
        <div className={styles.search_box}>
            <p>Searching</p>
            <button className={`${styles.stop_button} ${styles.mer}`} onClick={funct} >
                <p>Stop searching</p>
            </button>
        </div>
    );
}