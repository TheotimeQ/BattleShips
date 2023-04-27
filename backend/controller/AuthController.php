<?php
namespace controller;

class AuthController {

    static function register() {
        try {
            $token = \core\Auth::register(\Flight::request()->data->username, \Flight::request()->data->password);
            setcookie('token', $token, time() + 3600);

            \Flight::json(array(
                'success' => true,
                'message' => 'Registration successful',
                'token' => $token
            ));
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);
        }
    }

    static function login() {
        try {
            $token = \core\Auth::login(\Flight::request()->data->username, \Flight::request()->data->password);
            setcookie('token', $token, time() + 3600);

            \Flight::json(array(
                'success' => true,
                'message' => 'Login successful',
                'token' => $token
            ));
        } catch (\Exception $e) {
            \Flight::json(array(
                'success' => false,
                'message' => $e->getMessage()
            ), 400);
        }
    }

    static function getUser() {
        $headers = apache_request_headers();
        $token = $headers['authorization'];

        if (!$token) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in (no auth header)'
            ), 400);

            return;
        }

        if (substr($token, 0, 7) === 'Bearer ') {
            $token = substr($token, 7);
        }

        $currentUser = \core\Auth::getUser($token);

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in (invalid token)'
            ), 400);

            return;
        }

        \Flight::json(array(
            'success' => true,
            'id' => $currentUser["id"],
            'username' => $currentUser["username"]
        ));
    }

    static function getUsers() {
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        $users = \core\Auth::getUsers();

        $result = array_map(function($user) {
            return array(
                'id' => $user["id"],
                'username' => $user["username"]
            );
        }, $users);

        \Flight::json(array(
            'success' => true,
            'data' => $result
        ));
    }

    public static function getProfile($username) {
        $currentUser = \core\Auth::getUser(\core\Auth::getToken());

        if (!$currentUser) {
            \Flight::json(array(
                'success' => false,
                'message' => 'You are not logged in'
            ), 400);

            return;
        }

        $user = \core\Auth::getUserByUsername($username);

        if (!$user) {
            \Flight::json(array(
                'success' => false,
                'message' => 'User not found'
            ), 400);

            return;
        }

        $games = \core\Game::getGamesForUser($user["id"]);

        \Flight::json(array(
            'success' => true,
            'data' => array(
                'id' => $user["id"],
                'username' => $user["username"],
                'games' => $games
            )
        ));
    }

}