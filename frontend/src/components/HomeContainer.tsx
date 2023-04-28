import React, { useState, useEffect, useRef } from 'react';
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
    const [searching, setSearching] = useState<boolean>(false);
    const searchingRef = useRef(false);

    const updateMatchmaking = async () => { 

        if (!searchingRef.current) {
            return ;
        }

        const response = await service.matchmakeUpdate();
        if(response.success) {
            stopMatchmaking();
            router.push(`/game/${response.game_id}`);
            return ;
        } 
        else {
            if (response.message == "Waiting for opponent") {
                setTimeout(() => {  updateMatchmaking(); }, 1000);
            } else {
                setError(response.message);
                stopMatchmaking();
            }
        }
    }

    const stopMatchmaking = async() => {

        const response = await service.matchmakeStop();
        if(response.success) {
            setSearching(false);
            searchingRef.current = false;
        } else {
            setError(response.message);
        }
    }

    const startMatchmaking = async () => {

        if (!loggedIn) {
            router.push('/login');searching
            return;
        }

        const response = await service.matchmakeStart();
        if(response.success) {
            setSearching(true);
            searchingRef.current = true;
            updateMatchmaking();
        } else {
            setSearching(false);
            setError(response.message);
        }
    }

    const createGame = async() => {

        if (!loggedIn) {
            router.push('/login');
            return;
        }
        
        const response = await service.createGame();   
        if(response.success) {
            router.push(`/game/${response.game}`);
        } else {
            setError(response.message);
        }
    }

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <Image src="/images/logo.svg" alt="Battleship" width={400} height={400} style={{
                marginBottom: "50px"
            }}/>

            <div className={styles.button_box}>
                <HomeButton text="Créer une partie" onClick={(createGame)} img="bataille"/>
                <HomeButton text="Rejoindre une partie" onClick={(startMatchmaking)} img="join"/>
            </div>
            { searching && <SearchBox funct={(stopMatchmaking)} />}
            { error != "" && <ErrorBox text={error}/>}
        </div>
    );
}