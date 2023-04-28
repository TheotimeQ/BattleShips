import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/Profile.module.css';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function Profile() {
    const router = useRouter();
    const { username } = router.query;

    const [profile, setProfile] = useState<any>({});

    /*const updateProfile = (username: string) => {
        if(!service.isLoggedIn()) {
            router.push('/login');
            return;
        }

        service.getProfile(username).then((game) => {
            if(game.success) {
                setProfile(game.data);
            } else {
                router.push('/');
            }
        }).catch((error) => {
            router.push('/');
        });
    }

    useEffect(() => {
        if(!username) return;
        updateProfile(`${username}`);
    }, [username]);*/

    return (

        <div className={styles.main}>
            <ul className={styles.table_all}>
                <li className={styles.column_name}>
                    <div className={styles.column1_name}>Username</div>
                    <div className={styles.column2_name}>Nombre de parties jouées</div>
                    <div className={styles.column3_name}>Nombre de parties gagnées</div>
                </li>
                <li className={styles.values_first_column}>
                    <div>42235</div>
                    <div>John Doe</div>
                    <div>$350</div>
                </li>
                <li className={styles.values_second_column}>
                    <div>42442</div>
                    <div>Jennifer Smith</div>
                    <div>$220</div>
            </li>
                <li className={styles.values_third_column}>
                    <div>42257</div>
                    <div>John Smith</div>
                    <div>$341</div>
                </li>
            </ul>
      </div>
    );
}