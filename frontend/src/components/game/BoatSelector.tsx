import Image from 'next/image';

import { useEffect, useState } from 'react';

import styles from '@/styles/Game.module.css';
import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function BoatSelector({ gameDetails } : { gameDetails: any }) {
    const [ships, setShips] = useState<any>([]);

    const [orientation, setOrientation] = useState<string>("horizontal");
    const [selectedShip, setSelectedShip] = useState<any>(null);

    const updateShips = () => {
        service.getShips().then((ships) => {
            if(ships.success) {
                setShips(ships.data);
            }
        });
    }

    useEffect(() => {
        updateShips();
    }, []);

    return (<div>
        <p className={styles.boats_list_text}>Voici vos bateaux commandant :</p>
        <div className={styles.game_available_boats}>
            {
            ships.map((ship: any) => {
                return (<div className={`${styles.game_available_boat} ${selectedShip == ship.id ? styles.game_available_boat_selected : ""}`} onClick={() => setSelectedShip(ship.id)}>
                    <Image src={`/images/${ship.code}.png`} alt={ship.name} width="100" height="100"/>
                    <p>{ship.name}</p>
                </div>);
            })
            }
        </div>

        <div className={styles.orientation_selector}>
            <div className={styles.orientation_selector_buttons}>
                <button className={`${styles.orientation_selector_button} ${orientation == "horizontal" ? styles.selected : "" }`} onClick={() => {
                    setOrientation("horizontal");
                }}>Horizontal</button>
                
                <button className={`${styles.orientation_selector_button} ${orientation == "vertical" ? styles.selected : "" }`} onClick={() => {
                    setOrientation("vertical");
                }}>Vertical</button>
            </div>
        </div>
    </div>);
}