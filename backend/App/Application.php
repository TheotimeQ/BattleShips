<?php

namespace App;

use App\Controllers\DefaultController;
use CPE\Framework\AbstractApplication;
use CPE\Framework\Router;

class Application extends AbstractApplication
{
    public function run()
    {
        // default response if no route found
        $requestParams = [];

        // map all routes to corresponding controllers/actions
        $this->router = new Router($this);
        $this->router->mapDefault(DefaultController::class, '404');

        $this->router->map('/', DefaultController::class, 'index', 'GET');
        $this->router->map('/test/:int|nombre:', DefaultController::class, 'test', 'GET');

        $route = $this->router->findRoute();

        if (empty($route)) {
            throw new RuntimeException('no available route found for this URL');
        }
        $controller = $this->router->getController($route->controller);
        $controller->execute($route->action, $route->requestParams);
    }
}
