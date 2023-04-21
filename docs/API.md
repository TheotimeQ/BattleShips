# Documentation de l'API

## Authentification

- `POST /api/login` : connexion d'un utilisateur

```
{
    "username": "string",
    "password": "string"
}
```

- `POST /api/register` : déconnexion d'un utilisateur

```
{
    "username": "string",
    "password": "string"
}
```

## Utilisateurs

- `GET /api/users` : récupération de la liste des utilisateurs

## Parties

- `POST /api/games/create` : création d'une partie
- `POST /api/games/join` : rejoindre une partie

```
{
    "id": "string"
}
```

- `GET /api/games/:id` : récupération des informations d'une partie

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