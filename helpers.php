<?php
function __autoload($c)
{
    $file = getPathFromNamespace($c);
    if (file_exists($file)) {
        require_once $file;
    } else {
        throw new Exception("$file not found");
    }
}

function getPathFromNamespace($name)
{
    $segments = explode('\\', $name);
    $file = implode(DIRECTORY_SEPARATOR, $segments) . ".php";
    return $file;
}