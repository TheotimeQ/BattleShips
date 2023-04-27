# Conception

- Authentification 
  - Register
  - Login
<br><br>

- Action
  - Tirer
  - Placer bateau
<br><br>
    
- Game 
  - Get informations d'une game
  - Rejoindre une partie
  - Creer une partie
<br><br>

- Lobby
  - Get liste des joueurs
<br><br>

# Liste des *Endpoints*
<br>

## Authentification

<br>

### `POST /api/register` : registration d'un utilisateur

<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
      "username": "string",
      "password": "string"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "Invalid username or password"
                 "Username or password is empty"
                 "Username already exists"
  }

  Code : 200
  {
      "success": "True",
      "message": "Registration successful"
  }
  ```
<br><br>

### `POST /api/login` : Connexion d'un utilisateur
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
      "username": "string",
      "password": "string"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "Username or password is empty"
                 "Invalid username or password"
  }

  Code : 200
  {
      "success": "True",
      "message": "Login successful"
  }
  ```
<br><br>

## Parties
<br>

### `POST /api/games/create` : création d'une partie
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "success": "True",
      "message": "Game created"
      "game"   : "$game_id" 
  }
  ```
<br><br>

### `POST /api/games/join` : rejoindre une partie
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
      "id": "game_id"
  }
  ```

> Reponse

  ```
  Code : 404
  {
      "success": "False",
      "message": "Game not found"
  }

  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
                 "You can't join your own game"
                 "This game is full"
  }

  Code : 200
  {
      "success": "True",
      "message": "Game joined"
  }
  ```
<br><br>

### `GET /api/games/:id` : récupération des informations d'une partie
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 404
  {
      "success": "False",
      "message": "Game not found"
  }

  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "game": 
      {
          "shots": $all_player_shots
          "ships": $player ships
          "state": $state
          "yourturn": $turn
      }
  }
  ```
États de la partie :
- `waiting` : en attente de joueurs
- `ships_selection` : sélection des bateaux
- `playing` : en cours de jeu
- `finished` : partie terminée
<br><br>

### `POST /api/games/:id/shoot` : tirer sur une case
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
      "x": int
      "y": int
  }
  ```

> Reponse

  ```
  Code : 404
  {
      "success": "False",
      "message": "Game not found"
  }

  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
                  "X and Y must be between 0 and 9"
                  "X and Y must be numbers"
                  "You have already shot here"
  }

  Code : 200
  {
      "success": "True",
      "message": "Shoot successful",
      "hit": "True / False"
  }
  ```
<br><br>

### `POST /api/games/:id/ships` : sélection des bateaux

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
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
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "Ship on ship"
                 "Invalid ship identifier"
                 "Invalid "ship_size instead of $ship_size"
  }

  Code : 200
  {
      "success": "True",
      "message": "Ships placed"
  }
  ```
<br><br>

- `GET /api/games/:id/map` : recupere la maps de la game
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
                 "You are not in the game"
  }

  Code : 200
  {
      "success": "True",
      "your_map": 
      {
          "ships":
          [
            {
                "id": 1,
                "x": 0,
                "y": 1,
                "direction": 0
                "drown": "true",
            },
            {
                "id": 2,
                "x": 0,
                "y": 2,
                "direction": 0
                "down": "true",
            },
            {
                "id": 3,
                "x": 0,
                "y": 3,
                "direction": 0
                "down": "false",
            },
            {
                "id": 3,
                "x": 0,
                "y": 4,
                "direction": 0
                "down": "false",
            },
            {
                "id": 4,
                "x": 0,
                "y": 5,
                "direction": 0
                "down": "true",
            }
          ]
      },
      "shoots":
        [
          {
            "x": 0,
            "y": 4,
            "hit": 1,
            "on_us": "true"
          }
          {
            "x": 0,
            "y": 4,
            "hit": 1,
            "on_us": "false"
          }
          {
            "x": 0,
            "y": 4,
            "hit": 0,
            "on_us": "true"
          }
        ]
  }
  ```
<br><br>

- `GET /api/user` : récupération des donées de l'utilisateur actuellement connecté
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
  
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "Your are not logged in"
  }

  Code : 200
  {
      "success": "True",
      "id": $id,
      "username": $username
  }
  ```
<br><br>

- `GET /api/users` : récupération de la liste des utilisateurs
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "success": "True",
      "Data": [
            {"id": $id "username": $username},
            {"id": $id "username": $username}...
            ]
      
  }
  ```
<br><br>


## MatchMaking
- `GET /matchmaking/start` : demare la recherche de matchmaking
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
                 "You are already looking for game"
                 "You are already in game"
  }

  Code : 200
  {
      "success": "True",
      "message": "You started looking for game"
  }
  ```
<br><br>

- `GET /matchmaking/update` : regarde si on à trouvé une game
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "game_found": "False",
      "message": "You are not logged in"
                 "You are not looking for games"
                 "Waiting for opponent"
  }

  Code : 200
  {
      "game_found": "True",
      "game_id": $gameid  
  }
  ```
<br><br>

- `GET /matchmaking/stop` : stop la recherche de matchmaking
> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
      "message": "You are not looking for game"
  }

  Code : 200
  {
      "success": "True",
      "message": "You stopped looking for games"       
  }
  ```
<br><br>

