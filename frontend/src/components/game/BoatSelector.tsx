import Image from 'next/image';

import { useEffect, useState } from 'react';

import styles from '@/styles/Game.module.css';
import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function BoatSelector({ gameDetails, placedShips, onShipSelection, onFinished } : { gameDetails: any, placedShips: number[], onShipSelection: Function, onFinished: Function }) {
    const [ships, setShips] = useState<any>([]);

    const [orientation, setOrientation] = useState<string>("horizontal");
    const [selectedShip, setSelectedShip] = useState<any>(null);

    // when selected ship changes, we call the callback
    useEffect(() => {
        if(selectedShip == null) return;

        let ship = {
            id: selectedShip,
            orientation: orientation,
            size: parseInt(ships.find((s: any) => s.id == selectedShip).size)
        };

        onShipSelection(ship);
    }, [selectedShip, orientation]);

    useEffect(() => {
        if(ships.length == 0) return;
        if(placedShips.length == ships.length) {
            setSelectedShip(null);
            onFinished();
        }
    }, [placedShips]);

    const updateShips = () => {
        service.getShips().then((ships) => {
            if(ships.success) {
                let availabledShips = ships.data.filter((ship: any) => {
                    return !placedShips.includes(ship.id);
                });

                setShips(availabledShips);
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
            ships.filter((s: any) => !placedShips.includes(s.id)).map((ship: any) => {
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