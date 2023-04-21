<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page d'exemple</title>
</head>
<body>
    <h1><?php echo $pageTitle; ?></h1>
    <pre><?php print_r(get_defined_vars()); ?></pre>
    <ul>
        <li><a href="<?php echo $this->buildRoute("/n'importe quelle url inexistante"); ?>">Page 404</a></li>
        <li><a href="<?php
            $varContainingDynamicValue = 12;
            echo $this->buildRoute('/test/%s', $varContainingDynamicValue);
            ?>">Page paramétrée (avec la valeur 12)</a></li>
    </ul>
</body>
</html>