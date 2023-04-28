import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';

import styles from '@/styles/Home.module.css';

import BattleshipService from '@/services/Battleship.service';
import HomeButton from './buttons/HomeButton';
import SearchBox from './buttons/SearchBox';
import ErrorBox from './utils/ErrorBox';

const service = new BattleshipService();

export default function HomeContainer() {

    const router = useRouter();
    const loggedIn = service.isLoggedIn();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<any>(null);

    const updateMatchmaking = () => {
        service.matchmakeUpdate().then((response) => {
            setError(response.message);
            if(response.success) {
                setSearching(false);
                clearInterval(intervalId);
                router.push(`/game/${response.message}`);
                return ;
            } else {
                if (response.message = "Waiting for opponent"){
                    
                }
                else {
                    setError(response.message);
                    setSearching(false);
                    clearInterval(intervalId);
                }
            }
        });
    }

    const stopMatchmaking = () => {
        service.matchmakeStop().then((response) => {
            if(response.success) {
                setSearching(false);
                clearInterval(intervalId);
            } else {
                setError(response.message);
            }
        });
    }

    const startMatchmaking = () => {
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        setLoading(true);
        service.matchmakeStart().then((response) => {
            if(response.success) {
                setSearching(true);
                const id = setInterval(updateMatchmaking, 1000);
                setIntervalId(id);
            } else {
                setError(response.message);
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    const createGame = () => {
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        setLoading(true);
        service.createGame().then((response) => {            
            if(response.success) {
                router.push(`/game/${response.game}`);
            } else {
                alert(response.message);
            }
        }).finally(() => {
            setLoading(false);
        });
    }
    
    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <Image src="/images/logo.svg" alt="Battleship" width={400} height={400} style={{
                marginBottom: "50px"
            }}/>

            <div className={styles.button_box}>
                <HomeButton text="Créer une partie" onClick={(createGame)} img="bataille" disabled={loading} />
                <HomeButton text="Rejoindre une partie" onClick={(startMatchmaking)} img="join" disabled={loading} />
            </div>
            { searching && <SearchBox funct={(stopMatchmaking)}/>}
            { error != "" && <ErrorBox text={error}/>}
        </div>
    );
}