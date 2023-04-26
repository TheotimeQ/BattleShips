import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import ActionButton from '@/components/buttons/ActionButton';

import styles from '@/styles/Home.module.css';

import BattleshipService from '@/services/Battleship.service';

const service = new BattleshipService();

export default function HomeContainer() {
    const [ships, setShips] = useState<string>('');

    useEffect(() => {
        service.getShips().then((ships) => {
            setShips(JSON.stringify(ships));
        });
    }, []);
    
    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <Image src="/images/logo.svg" alt="Battleship" width={200} height={200} />
            <p>{ships}</p>
            <ActionButton text="Rejoindre une partie" />
            <ActionButton text="Créer une partie" />
        </div>
    );
}