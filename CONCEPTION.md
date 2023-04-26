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
  Header :
  {
      "Cookie": token="token"
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
  Header :
  {
      "Cookie": token="token"
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
  Header :
  {
      "Cookie": token="token"
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
  Header :
  {
      "Cookie": token="token"
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


### `POST /api/games/:id` : recupere infos map
<br>
> Requête

  ```
  Header :
  {
      "Cookie": token="token"
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
      "message": "Game not found"
  }

  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "success": "True",
      "message": "Game joined"
      
                  'success' => true,
            'data' => array(
                'state' => $game["state"],
                'your_turn' => $turn
  }
  ```
<br><br>

#---------------------------A COMPLETER-----------------------------------------------------


### `POST /api/games/:id/shoot` : tirer sur une case
### `POST /api/games/:id/ships` : sélection des bateaux
### `GET /api/users` : récupération de la liste des utilisateurs














<br><br><br><br><br><br><br><br><br>
États de la partie :
- `waiting` : en attente de joueurs
- `ships_selection` : sélection des bateaux
- `playing` : en cours de jeu
- `finished` : partie terminée

- `POST /api/games/:id/ships` : sélection des bateaux

```
{
    "ships": [
        {
            "x": "int",
            "y": "int",
            "direction": "string",
            "type": "string"
        }
    ]
}
```

- `POST /api/games/:id/shoot` : tirer sur une case

```
{
    "x": "int",
    "y": "int"
}
```


## Lobby

- `POST /api/games/:id` : recupere infos map
- `POST /api/games/:id/shoot` : tirer sur une case
- `GET /api/users` : récupération de la liste des utilisateurs