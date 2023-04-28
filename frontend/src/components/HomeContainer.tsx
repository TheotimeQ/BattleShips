import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';

import styles from '@/styles/Home.module.css';

import matchmakingService from '@/services/MatchMaking.service';

import HomeButton from './buttons/HomeButton';
import SearchBox from './buttons/SearchBox';
import ErrorBox from './utils/ErrorBox';

export default function HomeContainer() {

    const {push} = useRouter();

    const [searching, setSearching] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [ingame, setInGame] = useState<boolean>(false);

    useEffect(() => {
        matchmakingService.initialize(setMessage, push);

        async function checkInGame() {
            const currentlyInGame = await matchmakingService.isInGame();
            setInGame(currentlyInGame);
        }
        checkInGame()
    }, []);

    useEffect(() => {
        if (message == "Waiting for opponent") {
            setSearching(true);
        } else {
            setSearching(false);
        }
    }, [message]);

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <Image src="/images/logo.svg" alt="Battleship" width={400} height={400} style={{
                marginBottom: "50px"
            }}/>

            <div className={styles.button_box}>
                { !ingame && <HomeButton text="Créer une partie" onClick={matchmakingService.createGame} img="bataille"/>}
                { !ingame && <HomeButton text="Matchmaking" onClick={matchmakingService.start} img="join"/>}
                { ingame && <HomeButton text="Reprendre la partie" onClick={matchmakingService.start} img="bataille"/>}
            </div>
            { searching && <SearchBox funct={(matchmakingService.stop)} />}
            { message != "" && <ErrorBox text={message}/>}
        </div>
    );
}