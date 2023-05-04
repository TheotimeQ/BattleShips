import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';

import styles from '@/styles/Home.module.css';

import BattleshipService from '@/services/Battleship.service';
import matchmakingService from '@/services/MatchMaking.service';

import HomeButton from './buttons/HomeButton';
import SearchBox from './buttons/SearchBox';
import ErrorBox from './utils/ErrorBox';

const service = new BattleshipService();

export default function HomeContainer() {
    const {push} = useRouter();

    const [searching, setSearching] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [ingame, setInGame] = useState<boolean>(false);
    const [currentPlayer, setCurrentPlayer] = useState<string>("");

    const getCurrentPlayer = async () => {
        if(!service.isLoggedIn()) {
            return;
        }

        service.getUser().then((response) => {
            if(response.success) {
                setCurrentPlayer(response.username);
            }
        });
    }

    useEffect(() => {
        matchmakingService.initialize(setMessage, push);

        async function checkInGame() {
            const currentlyInGame = await matchmakingService.isInGame();
            setInGame(currentlyInGame);
        }

        checkInGame();

        getCurrentPlayer();
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
                { !ingame && <HomeButton text="Partie privée" onClick={matchmakingService.createGame} img="bataille"/>}
                { !ingame && <HomeButton text="Partie rapide" onClick={matchmakingService.start} img="join"/>}
                { ingame && <HomeButton text="Reprendre la partie" onClick={matchmakingService.start} img="bataille"/>}
                <HomeButton text="Classement" onClick={() => alert("Bientôt disponible")} img="leaderboard"/>
            </div>
            { currentPlayer && <div className={styles.player}>
                <Image src="/images/player.png" alt="player" width={50} height={50} />
                <p className={styles.player_name}>{currentPlayer}</p>    
            </div>}
            { searching && <SearchBox funct={(matchmakingService.stop)} />}
            { message != "" && <ErrorBox text={message}/> }
        </div>
    );
}