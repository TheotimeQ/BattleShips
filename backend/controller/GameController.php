<?php
namespace controller;

class GameController {

    static function getShips() {
        $ships = \core\Game::getShips();

        $result = array_map(function($ship) {
            return array(
                'id' => $ship['id'],
                'code' => $ship['code'],
                'name' => $ship['name'],
                'size' => $ship['size']
            );
        }, $ships);

        \Flight::json(array(
            'success' => true,
            'data' => $result
        ));
    }

    static function create() {
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        $game = \core\Game::create($currentUser);

        \Flight::json(array(
            'success' => true,
            'message' => 'Game created',
            'game' => $game
        ));
    }

    static function join() {
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        try {
            $game = \core\Game::setOpponent(\Flight::request()->data->id, $currentUser);
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'message' => 'Game joined'
        ));
    }

    static function get($id) {
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        try {
            $game = \core\Game::get($id);

            if($game["host"] != $currentUser["id"] && $game["opponent"] != $currentUser["id"]) {
                throw new \Exception("You are not in this game");
            }
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        $ennemy = $game["host"] == $currentUser["id"] ? $game["opponent"] : $game["host"];
        $turn = ($game["opponent"] == $currentUser["id"] && $game["current"] == 1) || ($game["host"] == $currentUser["id"] && $game["current"] == 0);

        $ennemyUser = false;
        $winnerUser = false;

        if($ennemy) {
            $ennemyUser = \core\Auth::getUserById($ennemy);
        }

        if($game["winner"]) {
            $winnerUser = \core\Auth::getUserById($game["winner"]);
        }

        \Flight::json(array(
            'success' => true,
            'data' => array(
                'state' => $game["state"],
                'winner' => $winnerUser ? $winnerUser["username"] : false,
                'your_turn' => $turn,
                'ennemy' => $ennemyUser ? $ennemyUser["username"] : false,
            )
        ));
    }

    static function ships($id) {
        if(!self::isAllowedToInteract($id, "ships_selection")) return;
        $user = \core\Auth::getUser(\core\Auth::getToken());

        try {
            $ships = \Flight::request()->data->ships;

            if (!is_array($ships)) throw new \Exception('Not an array of ships');

            if (\core\Game::isShipsValid($ships)) {
                \core\Game::setShips($ships, $user, $id);

                if (\core\Game::isReady($id)) {
                    \core\Game::setGameState($id, "running");
                }
            }
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'message' => 'Ships placed'
        ));
    }

    static function shoot($id) {
        if(!self::isAllowedToInteract($id, false, "running")) return;
        
        $user = \core\Auth::getUser(\core\Auth::getToken());

        $x = \Flight::request()->data->x;
        $y = \Flight::request()->data->y;

        try {
            $result = \core\Game::addShot($id, $user, $x, $y);
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'message' => 'Shoot successful',
            'hit' => $result
        ));
    }

    static function isAllowedToInteract($gameId, $ignoreTurns = true, $gameState = null) {
        $user = \core\Auth::getUser(\core\Auth::getToken());
        $game = \core\Game::get($gameId);

        if (!$user) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return false;
        }

        if ($game["host"] == $user["id"] && $game["current"] != 0 && !$ignoreTurns) {
            \Flight::json(array(
                'success' => false,
                'message' => 'It\'s not your turn'
            ), 400);

            return false;
        }

        if ($game["opponent"] == $user["id"] && $game["current"] != 1 && !$ignoreTurns) {
            \Flight::json(array(
                'success' => false,
                'message' => 'It\'s not your turn'
            ), 400);

            return false;
        }

        if ($game["host"] != $user["id"] && $game["opponent"] != $user["id"]) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not in this game'
            ), 400);

            return false;
        }

        if ($gameState && $game["state"] != $gameState) {
            \Flight::json(array(
                'success' => false,
                'message' => 'Game is not in the right state'
            ), 400);

            return false;
        }

        return true;
    }

    static function getmap($gameId)
    {
        if(!self::isAllowedToInteract($gameId, true, null)) return;

        try {
            $user = \core\Auth::getUser(\core\Auth::getToken());
            $ships = \core\Game::getMapShips($gameId, $user["id"]);
            $shoots = \core\Game::getMapShoots($gameId, $user["id"]);
        } 
        catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'ships' => $ships,
            'shoots' => $shoots
        ));
    }

}