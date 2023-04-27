import { useState, useEffect } from 'react';

import styles from '@/styles/Game.module.css';
import BoatSelector from './BoatSelector';
import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function GameBoard({ id, gameDetails } : { id: string, gameDetails: any }) {
    const state = gameDetails.state;
    
    const [ships, setShips] = useState<any>([]);
    const [selectedShip, setSelectedShip] = useState<any>(null);
    const [usedPositions, setUsedPositions] = useState<any>([]);

    const onShipSelection = (ship: any) => {
        setSelectedShip(ship);
    }

    const onFinished = () => {
        service.placeShips(id, ships).then((response) => {
            if(response.success) {
                console.log("ships placed");
            } else {
                alert("Error placing ships: " + response.message);
                setShips([]);
            }
        }).finally(() => {
            setSelectedShip(null);
        });
    }

    const verifyShipPlacement = (positions: any) => {
        for(let i = 0; i < positions.length; i++) {
            let position = positions[i];

            if(position.x < 1 || position.x > 10 || position.y < 1 || position.y > 10) {
                return false;
            }

            if(usedPositions.find((p: any) => p.x == position.x && p.y == position.y)) {
                return false;
            }
        }

        return true;
    }

    const calculateShipPosition = (ship: any) => {
        let x = ship.x;
        let y = ship.y;

        let positions = [];

        for(let i = 0; i < ship.size; i++) {
            if(ship.direction == 0) {
                positions.push({x: x + i, y: y});
            } else {
                positions.push({x: x, y: y + i});
            }
        }

        return positions;
    }

    const onGridClick = (x: number, y: number) => {        
        if(state == "ships_selection") {
            if(selectedShip == null) return;
            
            let ship = {
                id: selectedShip.id,
                direction: selectedShip.orientation == "horizontal" ? 0 : 1,
                x: x,
                y: y,
                size: selectedShip.size
            };

            const positions = calculateShipPosition(ship);
            if(!verifyShipPlacement(positions)) return;

            setUsedPositions([...usedPositions, ...positions]);
            setShips([...ships, ship]);
            
            setSelectedShip(null);
        }
    }

    let grid = [];

    for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
            let content = '';
            let style = styles.grid_cell;
            let clickEvent = () => {};

            if (i == 0 && j > 0) {
                content = j.toString();
                style = styles.grid_cell_indicator;
            } else if (j == 0 && i > 0) {
                content = String.fromCharCode(64 + i);
                style = styles.grid_cell_indicator;
            } else if (i == 0 && j == 0) {
                content = '';
                style = styles.grid_cell_indicator;
            } else {
                clickEvent = () => onGridClick(j, i);
            }

            row.push(<div className={style} onClick={clickEvent}>{content}</div>);
        }

        grid.push(<div className={styles.grid_row}>{row}</div>);
    }

    return (<div className={styles.centered_container}>
        <div className={styles.grid_container}>
            {grid}
        </div>
        { gameDetails.state == "ships_selection" && <BoatSelector gameDetails={gameDetails} placedShips={ships.map((s: any) => s.id)} onShipSelection={onShipSelection} onFinished={onFinished}></BoatSelector> }
    </div>);
}