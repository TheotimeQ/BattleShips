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

}