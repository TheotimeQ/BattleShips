import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import styles from '@/styles/Profile.module.css';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function Profile() {
    const router = useRouter();
    const { username } = router.query;

    const [profile, setProfile] = useState<any>({});

    const updateProfile = (username: string) => {
        if(!service.isLoggedIn()) {
            router.push('/login');
            return;
        }

        service.getProfile(username).then((result) => {
            if(result.success) {
                setProfile(result.data);
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
    }, [username]);

    return (<div className={styles.main}>
        <div className={styles.icon}>
            <Image src="/images/player.png" alt="Pirate" width="100" height="100"/>
        </div>
        <div className={styles.user}>
            <p className={styles.user_name}>{profile.username}</p>
        </div>
        <div className={styles.scores}>
            <div className={styles.score}>
                <p className={styles.score_number} >{profile.games?.filter((game: any) => game.won).length}</p>
                <p className={styles.score_details}>Gagnées</p>
            </div>
            <div className={styles.score}>
                <p className={styles.score_number} >{profile.games?.filter((game: any) => !game.won).length}</p>
                <p className={styles.score_details}>Perdues</p>
            </div>
            <div className={styles.score}>
                <p className={styles.score_number} >{profile.games?.length}</p>
                <p className={styles.score_details}>Jouées</p>
            </div>
        </div>
        <div className={styles.history_table}>
            <div className={`${styles.history_row} ${styles.row_names}`}>
                <p className={styles.history_cell} >ID Partie</p>
                <p className={styles.history_cell}>Gagnant</p>
            </div>
            {
                profile.games?.map((game: any) => {
                    return <div className={styles.history_row}>
                    <p className={styles.history_cell}>{game.id}</p>
                    <p className={styles.history_cell}>{game.won ? "👑" : "💩"}</p>
                </div>
                })
            }
        </div>
    </div>);
}