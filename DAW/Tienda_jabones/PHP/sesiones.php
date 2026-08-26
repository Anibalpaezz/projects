<?php
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    session_start();

    session_unset();
    session_destroy();

    header('Location: ../index.html');
    exit();
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

} else {
    
}