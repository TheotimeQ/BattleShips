<?php
namespace core;

class MatchControl {

    static function isUserMatchMaking($user_id) {
        $db = \Flight::db();
        try {
            $user = $db->prepare('SELECT * FROM matchmaking WHERE user_id = :user_id');
            $user->execute(array(':user_id' => $user_id));
            $user = $user->fetchAll();
            if (sizeof($user) > 0)
                return true;
        } catch (\Exception $e) {
            return false;
        }

        return false;
    }

    static function isAlreadyInGame($user_id) {
        $db = \Flight::db();

        try {
            $user = $db->prepare("SELECT * FROM games WHERE (host = :user_id OR opponent = :user_id) AND state != 'ended'");
            $user->execute(array(':user_id' => $user_id));
            $user = $user->fetchAll();
            if (sizeof($user) > 0)
                return true;
        } catch (\Exception $e) {
            return false;
        }

        return false;
    }

    static function start($user_id){
        $db = \Flight::db();
        $user_match = $db->prepare('INSERT INTO matchmaking (user_id, last_seen) VALUES (:user_id, :last_seen)');
        $user_match->execute(array(
            ':user_id' => $user_id,
            ':last_seen' => time()
        ));
    }

    static function createGame($user_id, $opponent_id) {

        $db = \Flight::db();
        $uuid = \Ramsey\Uuid\Uuid::uuid4();
        $db->prepare('INSERT INTO games (id, host, opponent, state) VALUES (:id, :host, :opponent, :state)')
            ->execute(array(
                ':id' => $uuid,
                ':host' => $user_id,
                ':opponent' => $opponent_id,
                ':state' => 'ships_selection'
            ));

        return $uuid;
    }

    static function update($user_id){
        $db = \Flight::db();

        $user_match = $db->prepare('UPDATE matchmaking SET last_seen = :last_seen WHERE user_id = :user_id');
        $user_match->execute(array(
            ':user_id' => $user_id,
            ':last_seen' => time()
        ));

        $user_match = $db->prepare('DELETE FROM matchmaking WHERE last_seen < :last_seen');
        $user_match->execute(array(
            ':last_seen' => time() - 10
        ));
        
        $game = $db->prepare("SELECT * FROM games WHERE (host = :user_id OR opponent = :opponent_id) AND state != 'ended'");
        $game->execute(array(
            ':user_id' => $user_id,
            ':opponent_id' => $user_id
        ));
        $game = $game->fetch();

        if ($game)
        {
            $user_match = $db->prepare('DELETE FROM matchmaking WHERE user_id = :user_id');
            $user_match->execute(array(
                ':user_id' => $user_id,
            ));
            return $game['id'];
        }

        $opponent = $db->prepare('SELECT * FROM matchmaking WHERE user_id != :user_id ORDER BY last_seen ASC LIMIT 1');
        $opponent->execute(array(
            ':user_id' => $user_id,
        ));
        $opponent = $opponent->fetchAll();
        if (sizeof($opponent) < 1)
            throw new \Exception('Waiting for opponent');
        $opponent = $opponent[0];

        $game_id = self::createGame($user_id, $opponent['user_id']);

        $user_match = $db->prepare('DELETE FROM matchmaking WHERE user_id = :user_id OR user_id = :opponent_id');
        $user_match->execute(array(
            ':user_id' => $user_id,
            ':opponent_id' => $opponent['user_id']
        ));

        return $game_id;
    }

    static function stop($user_id){
        $db = \Flight::db();
        $user_match = $db->prepare('DELETE FROM matchmaking WHERE user_id = :user_id');
        $user_match->execute(array(
            ':user_id' => $user_id,
        ));
    }

}