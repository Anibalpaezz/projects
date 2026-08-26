<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['mesas'])) {
        $mesaSeleccionada = $_POST['mesas'];
        $_SESSION['mesa'] = $mesaSeleccionada;
    } else {
        echo 'No se ha seleccionado ninguna mesa.';
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="Icon/favicon logo.png" type="image/x-icon">
    <link rel="stylesheet" href="CSS/globales.css">
    <link rel="stylesheet" type="text/css" href="CSS/confirmacion.css">
    <title>Confirmar reserva</title>
</head>

<body>
    <h1>Confirmar la reserva</h1>
    <form action="correo.php" method="post">
        <label for="correo">Correo electronico: </label>
        <input type="email" name="correo" id="correo">
        <button type="submit">Enviar</button>
    </form>
</body>

</html>