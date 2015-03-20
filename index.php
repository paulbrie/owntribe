<?php
$start = microtime(true);
ini_set("display_errors", 1);
include 'helpers.php';

$Main = new \owntribe\classes\Main(array(
    'debug' => true,
    'resource_not_found' => '\\owntribe\\classes\\Error',
    'start' => $start
));