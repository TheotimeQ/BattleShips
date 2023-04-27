<?php
namespace core;

const DIRECTION = array(
    'horizontal' => 0,
    'vertical' => 1
);

class Game {

    public static function getShips() {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM ships');
        $stmt->execute();
        $ships = $stmt->fetchAll();

        return $ships;
    }

    public static function setShips(array $ships, $player, $uuid) {
        $db = \Flight::db();

        $hasAlreadyPlaced = $db->prepare('SELECT * FROM game_ships WHERE game = :game AND player = :player');

        $hasAlreadyPlaced->execute(array(
            ':game' => $uuid,
            ':player' => (int) $player['id']
        ));

        $hasAlreadyPlaced = $hasAlreadyPlaced->fetchAll();
        if (count($hasAlreadyPlaced) > 0) throw new \Exception('You have already placed your ships');
        
        foreach($ships as $ship) {
            $db->prepare('INSERT INTO game_ships (game, ship, player, x, y, direction) VALUES (:game, :ship, :player, :x, :y, :direction)')
                ->execute(array(
                    ':game' => $uuid,
                    ':ship' => $ship['id'],
                    ':player' => $player['id'],
                    ':x' =>  $ship['x'],
                    ':y' => $ship['y'],
                    'direction' => $ship['direction']
            ));
        }
    }

    public static function create($player) {
        $db = \Flight::db();
        $uuid = \Ramsey\Uuid\Uuid::uuid4();

        $db->prepare('INSERT INTO games (id, host) VALUES (:id, :host)')
            ->execute(array(
                ':id' => $uuid,
                ':host' => $player['id']
            ));

        return $uuid;
    }

    public static function setOpponent($game, $opponent) {
        $db = \Flight::db();

        try {
            self::canJoin($game, $opponent);
        } catch (\Exception $e) {
            throw $e;
        }

        $db->prepare('UPDATE games SET opponent = :opponent, state = :state WHERE id = :id')
            ->execute(array(
                ':opponent' => $opponent['id'],
                ':state' => "ships_selection",
                ':id' => $game
            ));

        return true;
    }

    private static function canJoin($game, $player) {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM games WHERE id = :id');
        $stmt->execute(array(':id' => $game));
        $game = $stmt->fetch();

        if (!$game) throw new \Exception('Game not found', 404);
        if ($game['host'] === $player['id']) throw new \Exception('You can\'t join your own game');
        if ($game['opponent'] !== null) throw new \Exception('This game is full');

        return false;
    }

    public static function get($gameId) {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM games WHERE id = :id');
        $stmt->execute(array(':id' => $gameId));
        $game = $stmt->fetch();

        if (!$game) throw new \Exception('Game not found', 404);

        $shots = $db->prepare('SELECT * FROM game_shots WHERE game = :game');
        $shots->execute(array(':game' => $game['id']));
        $game['shots'] = $shots->fetchAll();

        $ships = $db->prepare('SELECT * FROM game_ships WHERE game = :game');
        $ships->execute(array(':game' => $game['id']));
        $game['ships'] = $ships->fetchAll();

        return $game;
    }

    public static function addShot($id, $player, $x, $y) {
        $db = \Flight::db();
        $game = self::get($id);

        if (!is_numeric($x) || !is_numeric($y)) throw new \Exception('X and Y must be numbers');
        if ($x < 0 || $x > 9 || $y < 0 || $y > 9) throw new \Exception('X and Y must be between 0 and 9');
        
        $ennemy = $game['host'] === $player['id'] ? $game['opponent'] : $game['host'];

        $already = $db->prepare('SELECT * FROM game_shots WHERE game = :game AND player = :player AND x = :x AND y = :y');
        
        $already->execute(array(
            ':game' => $game['id'],
            ':player' => $ennemy,
            ':x' => $x,
            ':y' => $y
        ));

        $already = $already->fetchAll();

        if (count($already) > 0) throw new \Exception('You have already shot here');

        $stmt = $db->prepare('INSERT INTO game_shots (game, player, x, y, hit) VALUES (:game, :player, :x, :y, :hit)');
        $hit = self::hitShot($game['id'], $ennemy, $x, $y);
        $stmt->execute(array(
            ':game' => $game['id'],
            ':player' => $ennemy,
            ':x' => $x,
            ':y' => $y,
            ':hit' => $hit
        ));

        $nextTurn = $game['host'] == $player['id'] ? 1 : 0;
        $hitted = self::checkHit($id, $ennemy, $x, $y);
        self::setTurn($game['id'], $nextTurn);

        return $hitted;
    }

    public static function hitShot($game, $target, $x, $y){
        $db = \Flight::db();
        $ships = $db->prepare('SELECT game_ships.id AS id, x, y, direction, size FROM game_ships, ships WHERE game = :game AND player = :player AND game_ships.ship = ships.id');
        
        $ships->execute(array(
            ':game' => $game,
            ':player' => $target
        ));

        $ships = $ships->fetchAll();
        foreach ($ships as $ship) {
            $positions = self::getPositionsForShip($ship);
            foreach ($positions as $position) {
                if ($position['x'] == $x && $position['y'] == $y) {
                    return 1;
                }
            }
        }
        return 0;
    }

    public static function checkHit($game, $target, $x, $y) {
        $db = \Flight::db();
        $ships = $db->prepare('SELECT game_ships.id AS id, x, y, direction, size FROM game_ships, ships WHERE game = :game AND player = :player AND game_ships.ship = ships.id');
        
        $ships->execute(array(
            ':game' => $game,
            ':player' => $target
        ));

        $ships = $ships->fetchAll();

        foreach ($ships as $ship) {
            $positions = self::getPositionsForShip($ship);

            foreach ($positions as $position) {
                if ($position['x'] == $x && $position['y'] == $y) {
                    if (self::checkIfShipDown($game, $target, $ship)) {  
                        $db->prepare('UPDATE game_ships SET down = 1 WHERE id = :id')
                            ->execute(array(':id' => $ship['id']));

                        if(self::isGameEnded($game)) {
                            $db->prepare('UPDATE games SET state = :state WHERE id = :id')
                                ->execute(array(
                                    ':state' => 'ended',
                                    ':id' => $game
                                ));
                        }
                        
                        return 2;
                    }

                    return 1;
                }
            }
        }

        return 0;
    }

    public static function getPositionsForShip($ship) {
        $positions = array();

        for ($i = 0; $i < $ship['size']; $i++) {
            $positions[] = array(
                'x' => $ship['x'] + ($ship['direction'] == DIRECTION["horizontal"] ? $i : 0),
                'y' => $ship['y'] + ($ship['direction'] == DIRECTION["vertical"] ? $i : 0)
            );
        }

        return $positions;
    }

    public static function checkIfShipDown($game, $target, $ship) {
        $db = \Flight::db();

        $positions = self::getPositionsForShip($ship);

        $stmt = $db->prepare('SELECT * FROM game_shots WHERE game = :game AND player = :player');
        
        $stmt->execute(array(
            ':game' => $game,
            ':player' => $target
        ));

        $shots = $stmt->fetchAll();
        $shotsOnShip = 0;

        foreach ($positions as $position) {
            $result = array_filter($shots, function($shot) use ($position) {
                return $shot['x'] == $position['x'] && $shot['y'] == $position['y'];
            });

            if (count($result) > 0) {
                $shotsOnShip++;
            }
        }

        return $shotsOnShip == $ship['size'];
    }

    public static function isShipsValid(array $ships) {
        $availableShips = self::getShips();
        $placedShips = array();

        foreach ($ships as $ship) {
            $result = array_filter($availableShips, function($availableShip) use ($ship) {
                return $availableShip['id'] == $ship['id'];
            });

            if (count($result) !== 1) throw new \Exception('Invalid ship identifier');
            if (!is_numeric($ship['x']) || !is_numeric($ship['y'])) throw new \Exception('Invalid ship position');

            $availableShip = array_values($result)[0];
            $ship['size'] = $availableShip['size']; 

            if ($ship['x'] < 0 || $ship['x'] > 9 || $ship['y'] < 0 || $ship['y'] > 9) throw new \Exception('Invalid ship position');
            if ($ship['direction'] !== DIRECTION["horizontal"] && $ship['direction'] !== DIRECTION["vertical"]) throw new \Exception('Invalid ship orientation');

            $positions = self::getPositionsForShip($ship);
            
            foreach ($positions as $position) {
                if ($position['x'] < 0 || $position['x'] > 9 || $position['y'] < 0 || $position['y'] > 9) throw new \Exception('Invalid ship position');
            }

            if (count($positions) != $availableShip['size']) throw new \Exception('Invalid ship size; ' . count($positions) . ' instead of ' . $availableShip['size']);

            $availableShips = array_filter($availableShips, function($availableShip) use ($ship) {
                return $availableShip['id'] !== $ship['id'];
            });

            $placedShips[] = $ship;
        }

        $allshipspos = array(); 

        foreach ($placedShips as $ship) {
            $position = self::getPositionsForShip($ship);

            foreach ($position as $pos) {
                if (in_array($pos, $allshipspos)) {
                    throw new \Exception('Ship on ship', 400);
                }
                
                $allshipspos[] = $pos;
            }
        }

        return true;
    }

    public static function isReady($id) {
        $db = \Flight::db();
        $availableShips = self::getShips();

        $ships = $db->prepare('SELECT * FROM game_ships WHERE game = :game');
        $ships->execute(array(':game' => $id));

        $ships = $ships->fetchAll();

        return count($ships) === count($availableShips) * 2;
    }

    public static function setTurn($id, $turn) {
        $db = \Flight::db();

        $stmt = $db->prepare('UPDATE games SET current = :current WHERE id = :id');
        $stmt->execute(array(':current' => $turn, ':id' => $id));
    }

    public static function setGameState($id, $state) {
        $db = \Flight::db();
        $stmt = $db->prepare('UPDATE games SET state = :state WHERE id = :id');
        $stmt->execute(array(':state' => $state, ':id' => $id));
    }

    public static function isGameEnded($id) {
        $db = \Flight::db();

        $ships = $db->prepare('SELECT * FROM game_ships WHERE game = :game AND down = 0');
        $ships->execute(array(':game' => $id));
        $ships = $ships->fetchAll();

        $players = array_unique(array_map(function($ship) {
            return $ship['player'];
        }, $ships));

        if (count($players) < 2) {
            return true;
        }

        return false;
    }

    public static function checkGameState($id, $state) {
        $db = \Flight::db();

        $game = $db->prepare('SELECT * FROM games WHERE id = :id');
        $game->execute(array(':id' => $id));
        $game = $game->fetch();

        return $game['state'] == $state;
    }

    public static function getMapShips($id, $user_id){
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM games WHERE id = :id');
        $stmt->execute(array(':id' => $id));
        $game = $stmt->fetch();

        if (!$game) throw new \Exception('Game not found', 404);

        $ships = $db->prepare('SELECT * FROM game_ships WHERE game = :game AND player = :player');
        $ships->execute(array(
            ':game' => $id,
            ':player' => $user_id
        ));
        $user_ships = $ships->fetchAll();

        $user_ships = array_map(function($ship) {
            return array(
                "id" => $ship["id"],
                "x" => $ship["x"],
                "y" => $ship["y"],
                "direction" => $ship["direction"],
                "down" => $ship["down"]
            );
        }, $user_ships);

        return $user_ships;
    }

    public static function getMapShoots($id, $user_id) {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM games WHERE id = :id');
        $stmt->execute(array(':id' => $id));
        $game = $stmt->fetch();

        if (!$game) throw new \Exception('Game not found', 404);

        $shoots = $db->prepare('SELECT * FROM game_shots WHERE game = :game');
        $shoots->execute(array(':game' => $id));
        $shoots = $shoots->fetchAll();

        $shoots = array_map(function($shoot) use ($user_id) {
            return array(
                "x" => $shoot["x"],
                "y" => $shoot["y"],
                "hit" => $shoot["hit"],
                "on_us" => ($shoot["player"] == $user_id)
            );
        }, $shoots);

        return $shoots;
    }
    
}