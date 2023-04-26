from requests import post, get
import os

os.system("php -S 127.0.0.1:3000 -t " + os.path.dirname(os.path.realpath(__file__)) + "/../backend")

Url_base = "http://127.0.0.1:3000"

json_ship_1 = {
        "ships": [
            {
                "id": 1,
                "x": 0,
                "y": 1,
                "direction": 0
            },
            {
                "id": 2,
                "x": 0,
                "y": 2,
                "direction": 0
            },
            {
                "id": 3,
                "x": 0,
                "y": 3,
                "direction": 0
            },
            {
                "id": 3,
                "x": 0,
                "y": 4,
                "direction": 0
            },
            {
                "id": 4,
                "x": 0,
                "y": 5,
                "direction": 0
            }
        ]
    }

class Client:
    
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.token = None
        self.Cookie = {'token': self.token}
        self.GameId = None
        self.JsonShips = None

    def Register(self):
        response = post(f"{Url_base}/api/register", json={"username": self.username, "password": self.password})
        print(response.status_code, response.json())
    
    def Login(self):
        response = post(f"{Url_base}/api/login", json={"username": self.username, "password": self.password})
        print(response.status_code, response.json())
        if (response.status_code == 200):
            self.token = response.json()["token"]
            self.Cookie = {'token': self.token}
            
    def CreateGame(self):
        response = post(f"{Url_base}/api/games/create", cookies=self.Cookie)
        self.GameId = response.json()["game"]
        print(response.status_code, response.json())
        
    def JoinGame(self, game_id):
        response = post(f"{Url_base}/api/games/join", cookies=self.Cookie, json={"id": game_id})
        self.GameId = game_id
        print(response.status_code, response.json())
        
    def PlaceShip(self, json_ships):
        self.JsonShips = json_ships
        response = post(f"{Url_base}/api/games/{str(self.GameId)}/ships", json=json_ships, cookies=self.Cookie)
        print(response.status_code, response.json())
        
    def Shoot(self, x, y):
        response = post(f"{Url_base}/api/games/{str(self.GameId)}/shoot", json={"x": x, "y": y}, cookies=self.Cookie)
        print(response.status_code, response.json())
        
    def GetGame(self):
        response = get(f"{Url_base}/api/games/{str(self.GameId)}", cookies=self.Cookie)
        print(response.status_code, response.json())
        
    def __str__(self):
        return f"Client: {self.username}, {self.password}, {self.token}"
    
print("---------------------------------------Good test----------------------------------------")            

print("----------Creating clients----------")
Client_1 = Client("Timto", "1234")
Client_1.Register()
Client_1.Login()
print(Client_1)


Client_2 = Client("Poyton", "5678")
Client_2.Register()
Client_2.Login()
print(Client_2)

print("----------Creating game----------")
Client_1.CreateGame()

print("----------Joining game----------")
Client_2.JoinGame(Client_1.GameId)
Client_1.JoinGame(Client_1.GameId)

# print("----------Placing Ships----------")
# Client_1.PlaceShip(json_ship_1)
# Client_2.PlaceShip(json_ship_1)

# print("----------Shooting----------")
# Client_1.Shoot(0, 0)
# Client_1.Shoot(0, 0)

# Client_2.Shoot(0, 0)
# Client_2.Shoot(0, 0)

# for x in range(10):
#     for y in range(10):
#         Client_1.Shoot(x, y)
#         Client_2.Shoot(x, y) 

# Client_1.Shoot(0, 0)
# Client_2.Shoot(0, 0) 
# Client_1.Shoot(0, 0)
# Client_2.Shoot(0, 0) 
        
# Client_1.GetGame()
# Client_2.GetGame()
        
print("---------------------------------------Mauvais test----------------------------------------")