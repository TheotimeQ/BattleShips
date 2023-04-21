<?php
namespace controller;

class MainController {

    static function index() {
        \Flight::json(array(
            'success' => true
        ));
    }

}