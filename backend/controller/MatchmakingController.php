<?php
namespace controller;

class MatchmakingController {

    static function start() {

        $currentUser = \core\Auth::getUser(\core\Auth::getToken());
        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        try {
            \core\Match::start($currentUser['id']);
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => 'Something went wrong'
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'message' => "You started looking for game"
        ));
    }

    static function update() {
        
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());
        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        try {
            $game_id = \core\Match::update($currentUser['id']);
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);

            return;
        }

        if (!$game_id) {
            \Flight::json(array(
                'success' => false,
                'message' => 'Something went wrong'
            ), 400);

            return;
        }
        
        \Flight::json(array(
            'success' => true,
            'game_id' => $game_id
        ));
    }

    static function stop() {

        $currentUser = \core\Auth::getUser(\core\Auth::getToken());
        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        // if (!\core\Match::isUserMatchmaking($currentUser['id'])) {
        //     \Flight::json(array(
        //         'success' => false,
        //         'message' => 'You are not looking for game'
        //     ), 400);

        //     return;
        // }

        try {
            \core\Match::stop($currentUser['id']);
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => 'Something went wrong'
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'message' => "You stopped looking for game"
        ));
    }

}