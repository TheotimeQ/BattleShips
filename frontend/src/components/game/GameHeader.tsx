import Image from 'next/image';

import styles from '@/styles/Game.module.css';

export default function GameHeader({ gameDetails } : { gameDetails: any }) {
    const state = gameDetails.state;

    if(state == "waiting") {
        return GameHeaderWaiting({ gameDetails });
    } else if (state == "ships_selection") {
        return GameHeaderSelection({ gameDetails });
    } else if (state == "running") {
        return GameHeaderRunning({ gameDetails });
    }

    return (<p>état inconnu</p>);
}

function GameHeaderWaiting({ gameDetails } : { gameDetails: any }) {
    return (<div>
        <h1 className={styles.game_title}>En attente d'un adversaire...</h1>
        <p className={styles.game_subtitle}>Partagez ce lien avec vos amis pour jouer avec eux !</p>
    </div>);
}
            

function GameHeaderSelection({ gameDetails } : { gameDetails: any }) {
    return (<div>
        <h1 className={styles.game_title}>Placez vos bateaux commandant !</h1>
        <p className={styles.game_subtitle}>Vous pouvez placer vos bateaux en cliquant sur les cases de la grille.</p>
        <div className={styles.game_players}>
            <div className={`${styles.game_player} ${gameDetails.your_turn ? styles.player_current : ""}`}>
                <Image src="/images/player.png" alt="Pirate" width="50" height="50"/>

                <p className={styles.game_player_name}>Vous</p>
            </div>

            <div className={`${styles.game_player} ${!gameDetails.your_turn ? styles.player_current : ""}`}>
                <p className={styles.game_player_name}>Ennemi</p>
                <Image src="/images/player.png" alt="Pirate" width="50" height="50"/>
            </div>
        </div>
    </div>);
}

function GameHeaderRunning({ gameDetails } : { gameDetails: any }) {
    return (<div>
        <h1 className={styles.game_title}>{gameDetails.your_turn ? "A votre tour de jouer !" : "En attente de l'adversaire..."}</h1>
        <p className={styles.game_subtitle}>{gameDetails.your_turn ? "Cliquez sur la grille pour choisir ou vous souhaitez tirer." : "Attendez que votre adversaire tire pour jouer."}</p>
        <div className={styles.game_players}>
            <div className={`${styles.game_player} ${gameDetails.your_turn ? styles.player_current : ""}`}>
                <Image src="/images/player.png" alt="Pirate" width="50" height="50"/>

                <p className={styles.game_player_name}>Vous</p>
            </div>

            <div className={`${styles.game_player} ${!gameDetails.your_turn ? styles.player_current : ""}`}>
                <p className={styles.game_player_name}>Ennemi</p>
                <Image src="/images/player.png" alt="Pirate" width="50" height="50"/>
            </div>
        </div>
    </div>);         
}