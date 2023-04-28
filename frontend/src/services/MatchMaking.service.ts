import BattleshipService from "./Battleship.service";

class MatchMakingService {

    private static instance: MatchMakingService;
    private service: BattleshipService = new BattleshipService();
    private searching = false;
    private setMessage : ((message : string) => void) | null = null;
    private navigate : ((message : string) => void) | null = null;

    constructor() {
        if (MatchMakingService.instance) {
            return MatchMakingService.instance;
        }
        MatchMakingService.instance = this;
    }

    public initialize = async (setMessage : (message : string) => void, navigate : (message : string) => void) => {
        this.setMessage = setMessage;
        this.navigate = navigate;
    }

    private isInitialized = () => {
        if (!this.setMessage || !this.navigate) {
            return false;
        }
        return true;
    }

    public start = async () => {

        if (!this.isInitialized()) { 
            console.log("MatchMakingService not initialized");
            return ; 
        }

        if (!this.service.isLoggedIn()) {
            this.navigate!('/login');
            return;
        }

        const response = await this.service.matchmakeStart();
        if(response.success) {
            this.searching = true;
            this.update();
        } else {
            this.setMessage!(response.message);
        }
    }

    public stop = async() => {

        if (!this.isInitialized()) { 
            console.log("MatchMakingService not initialized");
            return ; 
        }

        const response = await this.service.matchmakeStop();
        if(response.success) {
            this.searching = false;
        } else {
            this.setMessage!(response.message);
        }
    }

    private update = async () => { 

        if (!this.isInitialized()) { 
            console.log("MatchMakingService not initialized");
            return ; 
        }

        if (!this.searching) {
            return ;
        }

        const response = await this.service.matchmakeUpdate();
        if(response.success) {
            this.searching = false;
            this.navigate!(`/game/${response.game_id}`);
            return ;
        } 
        else {
            if (response.message === "Waiting for opponent") {
                this.setMessage!(response.message);
                setTimeout(() => { this.update(); }, 5000);
            } 
            else {
                this.searching = false;
                this.setMessage!(response.message);
            }
        }
    }

    public createGame = async() => {

        if (!this.isInitialized()) { 
            console.log("MatchMakingService not initialized");
            return ; 
        }
        
        if (!this.service.isLoggedIn()) {
            this.navigate!('/login');
            return;
        }

        const response = await this.service.createGame();   
        if(response.success) {
            this.navigate!(`/game/${response.game}`);
        } else {
            this.setMessage!(response.message);
        }
    }

    public isInGame = async() => {

        if (!this.isInitialized()) { 
            console.log("MatchMakingService not initialized");
            return (false);
        }
        
        if (!this.service.isLoggedIn()) {
            this.navigate!('/login');
            return (false);
        }

        const response = await this.service.isingame();   
        return (response.success);
    }
}

const matchmakingService = new MatchMakingService();
export default matchmakingService;