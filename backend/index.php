<?php
require 'vendor/autoload.php';

require 'core/Auth.php';
require 'core/Game.php';
require 'core/Match.php';

require 'controller/MainController.php';
require 'controller/AuthController.php';
require 'controller/GameController.php';
require 'controller/MatchmakingController.php';

use controller\AuthController;
use controller\GameController;
use controller\MainController;
use controller\MatchmakingController;

// Allow CORS
header('Access-Control-Allow-Origin: *');

//Pdo return eroor in exeption php
Flight::set('flight.log_errors', true);

Flight::register('db', 'PDO', array('sqlite:db/battleship.db'), function($db) {
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
});

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
Flight::route('GET /api/profile/@username', function($username) { AuthController::getProfile($username); });  

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

//Matchmaking
Flight::route('GET /api/matchmaking/start', function() { MatchmakingController::start(); });
Flight::route('GET /api/matchmaking/update', function() { MatchmakingController::update(); });
Flight::route('GET /api/matchmaking/stop', function() { MatchmakingController::stop(); });
Flight::route('GET /api/matchmaking/isingame', function() { MatchmakingController::isInGame(); });

Flight::start();