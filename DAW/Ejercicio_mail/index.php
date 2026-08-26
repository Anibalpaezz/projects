<?php
$ruta = 'fotos/';
$carpetas = scandir($ruta);
$carpetas = array_diff($carpetas, array('.', '..'));
$nombre_carpetas = array();

foreach ($carpetas as $archivo) {
    if (is_dir($ruta . '/' . $archivo)) {
        $nombre_carpetas[] = $archivo;
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @import url(https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap);*,body{text-align:center}*{font-family:Archivo Black;font-weight:100;align-items:center}body{background-color:#cab991;color:#333}h1{color:#141414}button,select{background-color:#374c36;color:beige;font-size:15px;height:40px;padding:10px;border:none;margin-top:10px;cursor:pointer;border-radius:5px}select{width:200px}button:hover,select:hover{background-color:#030}
    </style>
</head>

<body>
    <h1>¿Qué tipo de postales deseas enviar?</h1>
    <form action="tipos.php" method="post">
        <select name="tipo" id="tipo">
            <?php
            foreach ($nombre_carpetas as $nombre_carpeta) {
                echo '<option value="' . $nombre_carpeta . '">' . $nombre_carpeta . '</option>';
            }
            ?>
        </select>
        <button type="submit">Enviar</button>
    </form>
</body>

</html>