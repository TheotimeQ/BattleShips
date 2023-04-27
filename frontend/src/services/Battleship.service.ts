import { headers } from "next/dist/client/components/headers";

class BattleshipService {

    private static instance: BattleshipService;
    
    private token: string | null = null;

    constructor(token: string | null = null) {
        if (BattleshipService.instance) {
            return BattleshipService.instance;
        }

        if (typeof window !== 'undefined') {
            this.token = token ? token : localStorage.getItem('token');
        } else {
            this.token = token;
        }


        BattleshipService.instance = this;
    }

    public isLoggedIn(): boolean {
        return !!this.token;
    }

    public setToken(token: string) {
        this.token = token;

        if(typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    public async login(username: string, password: string): Promise<any> {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let result = await response.json();

        if(result.success) {
            this.setToken(result.token);
        }

        return result;
    }

    public async register(username: string, password: string): Promise<any> {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

    public async getShips(): Promise<any> {
        const response = await fetch('/api/ships');
        return response.json();
    }

    public async createGame(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/games/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async joinGame(gameId: string): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/games/join', {
            method: 'POST',
            body: JSON.stringify({ id: gameId }),
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

    public async getGame(gameId: string): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch(`/api/games/${gameId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async placeShips(gameId: string, ships: any): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch(`/api/games/${gameId}/place`, {
            method: 'POST',
            body: JSON.stringify(ships),
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

    public async shoot(gameId: string, x: number, y: number): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch(`/api/games/${gameId}/shoot`, {
            method: 'POST',
            body: JSON.stringify({ x, y }),
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

    public async getUsers(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async getUser(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async matchmakeStart(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/matchmaking/start', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async matchmakeUpdate(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/matchmaking/update', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

    public async matchmakeStop(): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const response = await fetch('/api/matchmaking/stop', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return response.json();
    }

}

export default BattleshipService;