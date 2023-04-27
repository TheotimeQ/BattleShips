-- Table contenant les utilisateurs

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "username" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL
);

-- Table contenant les bateaux

CREATE TABLE IF NOT EXISTS "ships" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" varchar(255) NOT NULL,
    "code" varchar(255) NOT NULL,
    "size" int NOT NULL
);

-- Table contenant les parties en cours

CREATE TABLE IF NOT EXISTS "games" (
    "id" varchar(255) UNIQUE NOT NULL PRIMARY KEY,
    "state" varchar(255) NOT NULL DEFAULT 'waiting',
    "current" int NOT NULL DEFAULT 0,
    "host" int NOT NULL,
    "opponent" int,
    "winner" int
);

-- Table contenant les positions des bateaux sur le plateau de jeu

CREATE TABLE IF NOT EXISTS "game_ships" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "game" varchar(255) NOT NULL,
    "ship" int NOT NULL,
    "player" int NOT NULL,
    "x" int NOT NULL,
    "y" int NOT NULL,
    "direction" int NOT NULL,
    "down" int NOT NULL DEFAULT 0,
    FOREIGN KEY (game) REFERENCES games(id),
    FOREIGN KEY (ship) REFERENCES ships(id)
);

-- Table contenant les tirs effectués par les joueurs

CREATE TABLE IF NOT EXISTS "game_shots" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "game" varchar(255) NOT NULL,
    "player" int NOT NULL,
    "x" int NOT NULL,
    "y" int NOT NULL,
    "hit" int NOT NULL DEFAULT 0,
    FOREIGN KEY (game) REFERENCES games(id)
);

-- Table contenant les users en recherche de matchmaking

CREATE TABLE IF NOT EXISTS "matchmaking" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "player" varchar(255) NOT NULL,
    "last_seen" int NOT NULL,
    FOREIGN KEY (player) REFERENCES users(id)
);


-- On crée deux utilsateurs pour nos tests
-- user1:password
-- user2:password

INSERT INTO users (username, password) VALUES ('user1', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'), ('user2', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');

-- On rajoute les bateaux

INSERT INTO ships (name, code, size) VALUES ('Porte-avion', 'aircraft-carrier', 5), ('Croiseur', 'cruiser', 4), ('Contre-torpilleur', 'destroyer', 3), ('Contre-torpilleur', 'destroyer', 3), ('Torpilleur', 'torpedo-boat', 2);