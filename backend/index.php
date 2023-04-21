<?php
require 'vendor/autoload.php';

require 'core/Auth.php';
require 'core/Game.php';

require 'controller/MainController.php';
require 'controller/AuthController.php';
require 'controller/GameController.php';

use controller\AuthController;
use controller\GameController;
use controller\MainController;

Flight::register('db', 'PDO', array('sqlite:db/battleship.db'));

function migrate() {
    $db = Flight::db();
    $migationScript = file_get_contents('db/migrate.sql');
    $db->exec($migationScript);
}

if (!file_exists('db/battleship.db')) {
    migrate();
}

// Main route
Flight::route('/', function() { MainController::index(); });

// Routes for authentication
Flight::route('POST /api/login', function() { AuthController::login(); }); // Finished
Flight::route('POST /api/register', function() { AuthController::register(); }); // Finished
Flight::route('GET /api/users', function() { AuthController::getUsers(); }); // Finished

// Routes for boats
Flight::route('GET /api/ships', function() { GameController::getShips(); }); // Finished

// Routes for games
Flight::route('POST /api/games/create', function() { GameController::create(); }); // Finished
Flight::route('POST /api/games/join', function() { GameController::join(); }); // Finished
Flight::route('GET /api/games/@id', function($id) { GameController::get($id); });

// Routes for game actions
Flight::route('POST /api/games/@id/ships', function($id) { GameController::ships($id); });
Flight::route('POST /api/games/@id/shoot', function($id) { GameController::shoot($id); });

Flight::start();