import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function Game() {
    const router = useRouter();
    const { id } = router.query;

    const [gameDetails, setGameDetails] = useState<any>([]);

    const updateGameDetails = (id: string) => {        
        if(!service.isLoggedIn()) {
            router.push(`/login`);
        }
        
        if(!id) return;

        service.getGame("a").then((game) => {
            if(game.success) {
                setGameDetails(game.data);
            } else {
                router.push(`/`);
            }
        }).catch((error) => {
            router.push(`/login`);
        });
    }

    useEffect(() => {
        updateGameDetails(`${id}`);
    }, [id]);

    return <p>Game {gameDetails}</p>;
}