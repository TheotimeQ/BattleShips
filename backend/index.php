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

// Allow CORS
header('Access-Control-Allow-Origin: *');

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
Flight::route('POST /api/login', function() { AuthController::login(); });  
Flight::route('POST /api/register', function() { AuthController::register(); });  
Flight::route('GET /api/user', function() { AuthController::getUser(); });  
Flight::route('GET /api/users', function() { AuthController::getUsers(); });  

// Routes for boats
Flight::route('GET /api/ships', function() { GameController::getShips(); });  

// Routes for games
Flight::route('POST /api/games/create', function() { GameController::create(); });  
Flight::route('POST /api/games/join', function() { GameController::join(); });  
Flight::route('GET /api/games/@id', function($id) { GameController::get($id); });
Flight::route('GET /api/games/@id/map', function($id) { GameController::getmap($id); });

// Routes for game actions
Flight::route('POST /api/games/@id/ships', function($id) { GameController::ships($id); });
Flight::route('POST /api/games/@id/shoot', function($id) { GameController::shoot($id); });

Flight::start();