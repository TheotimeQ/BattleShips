import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/Game.module.css';

import GameBoard from '@/components/game/GameBoard';

import BattleshipService from '@/services/Battleship.service';
import GameHeader from '@/components/game/GameHeader';
import BoatSelector from '@/components/game/BoatSelector';

const service = new BattleshipService();

export default function Game() {
    const router = useRouter();
    const { id } = router.query;

    const [gameDetails, setGameDetails] = useState<any>([]);
    const [gameMap, setGameMap] = useState<any>([]);
    
    const updateGameDetails = (id: string) => {        
        if(!service.isLoggedIn()) {
            router.push(`/login`);
            return;
        }

        service.getGame(id).then((game) => {
            if(game.success) {
                setGameDetails(game.data);

                service.getGameMap(id).then((map) => {
                    if(map.success) {
                        setGameMap(map);

                        setTimeout(() => {
                            updateGameDetails(id);
                        }, 1000);
                    } else {
                        alert("Error getting game map: " + map.message);
                    }
                });
            } else {
                service.joinGame(id).then((game) => {
                    if(game.success) {
                        updateGameDetails(id);
                    } else {
                        router.push(`/`);
                    }
                });
            }
        }).catch((error) => {
            router.push(`/login`);
        });
    }

    useEffect(() => {
        if(!id) return;
        updateGameDetails(`${id}`);
    }, [id]);

    return (
        <div className={styles.main}>
            <GameHeader gameDetails={gameDetails} />
            <GameBoard id={`${id}`} gameDetails={gameDetails} gameMap={gameMap} />
        </div>
    );
}