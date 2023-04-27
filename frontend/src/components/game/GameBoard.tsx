import styles from '@/styles/Game.module.css';
import BoatSelector from './BoatSelector';

export default function GameBoard({ gameDetails } : { gameDetails: any }) {
    const state = gameDetails.state;

    let grid = [];

    for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
            let content = '';
            let style = styles.grid_cell;

            if (i == 0 && j > 0) {
                content = j.toString();
                style = styles.grid_cell_indicator;
            } else if (j == 0 && i > 0) {
                content = String.fromCharCode(64 + i);
                style = styles.grid_cell_indicator;
            } else if (i == 0 && j == 0) {
                content = '';
                style = styles.grid_cell_indicator;
            }

            row.push(<div className={style}>{content}</div>);
        }

        grid.push(<div className={styles.grid_row}>{row}</div>);
    }

    return (<div className={styles.centered_container}>
        <div className={styles.grid_container}>
            {grid}
        </div>
        { gameDetails.state == "ships_selection" && <BoatSelector gameDetails={gameDetails}></BoatSelector> }
    </div>);
}