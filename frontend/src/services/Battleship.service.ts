class BattleshipService {

    private static instance: BattleshipService;
    private token: string | null = null;

    constructor(token: string | null = null) {
        if (BattleshipService.instance) {
            return BattleshipService.instance;
        }

        this.token = token;
        BattleshipService.instance = this;
    }

    public isLoggedIn(): boolean {
        return !!this.token;
    }

    public async login(username: string, password: string): Promise<any> {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        let result = await response.json();

        if(result.success) {
            this.token = result.token;
        }

        return result;
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
                'Authorization': `Bearer ${this.token}`
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
                'Authorization': `Bearer ${this.token}`
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
                'Authorization': `Bearer ${this.token}`
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

}

export default BattleshipService;