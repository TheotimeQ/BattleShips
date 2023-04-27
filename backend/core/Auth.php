<?php
namespace core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// define the key constant
const KEY = 'battleship';

class Auth {

    public static function login($username, $password) {
        if (empty($username) || empty($password)) throw new \Exception('Username or password is empty');
        if (!self::checkCredentials($username, $password)) throw new \Exception('Invalid username or password');

        $token = JWT::encode(array('username' => $username), KEY, 'HS256');
        return $token;
    }

    public static function register(string $username, string $password) {
        $db = \Flight::db();

        if (empty($username) || empty($password)) throw new \Exception('Username or password is empty');
        if (self::userExists($username)) throw new \Exception('Username already exists');

        $password = hash('sha256', $password);

        $stmt = $db->prepare('INSERT INTO users (username, password) VALUES (:username, :password)');
        $stmt->execute(array(':username' => $username, ':password' => $password));

        $token = JWT::encode(array('username' => $username), KEY, 'HS256');
        return $token;
    }

    private static function checkCredentials(string $username, string $password) {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute(array(':username' => $username));
        $user = $stmt->fetch();

        if (!$user) return false;

        $password = hash('sha256', $password);

        return $user['password'] === $password;
    }

    private static function userExists(string $username) {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute(array(':username' => $username));
        $user = $stmt->fetch();

        return $user ? true : false;
    }

    public static function getUser($token) {
        $db = \Flight::db();
        if (!is_string($token) || empty($token)) return false;

        try {
            $decoded = JWT::decode($token, new Key(KEY, 'HS256'));
            $user = $db->prepare("SELECT * FROM users WHERE username = :username");
            $user->execute(array(':username' => $decoded->username));
            return $user->fetch();
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function getUsers() {
        $db = \Flight::db();

        $stmt = $db->prepare('SELECT * FROM users');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getToken() {
        $headers = apache_request_headers();
        if (!isset($headers['authorization'])) return false;
        $token = $headers['authorization'];

        if (substr($token, 0, 7) === 'Bearer ') {
            $token = substr($token, 7);
        }

        return $token;
    }

}