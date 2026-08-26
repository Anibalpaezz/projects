<?php
include("PHP/conexion.php");

function horas()
{
    $archivo = fopen("Doc/horas.txt", "r");

    if ($archivo === false) {
        echo "No se pudo abrir el archivo.\n";
        exit(1);
    }

    while (($linea = fgets($archivo)) !== false) {
        $horas[] = $linea;
    }

    fclose($archivo);
    return $horas;
}

function restaurante()
{
    try {
        $consulta = conectarBD()->prepare("SELECT DISTINCT restaurante FROM mesa");
        if ($consulta->execute()) {
            echo "bien";
            $resultados = $consulta->fetchAll();
            return $resultados;
        }
    } catch (\Throwable $th) {
        throw $th;
    }
}

function comensales()
{
    try {
        $consulta = conectarBD()->prepare("SELECT DISTINCT MAX(capacidad) FROM mesa WHERE restaurante = :restaurante");
        if ($consulta->execute()) {
            echo "bien";
            $resultados = $consulta->fetchAll();
            return $resultados;
        }
    } catch (\Throwable $th) {
        throw $th;
    }
}


?>

<!DOCTYPE html>
<html>

<head>
    <title>Mesa-alvas las citas</title>
    <link rel="shortcut icon" href="Icon/favicon logo.png" type="image/x-icon">
    <link rel="stylesheet" href="CSS/globales.css">
    <link rel="stylesheet" type="text/css" href="CSS/index.css">

    <script>
        function actualizarCapacidadMaxima() {
            var restauranteSelect = document.getElementById("restaurante");
            var comensalesInput = document.getElementById("comensales");

            var restauranteSeleccionado = restauranteSelect.value;
            console.log(restauranteSeleccionado);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    comensalesInput.max = xhr.responseText;
                }
            };
            xhr.open("GET", "comensales_index.php?restaurante=" + encodeURIComponent(restauranteSeleccionado), true);
            xhr.send();
        }
    </script>
</head>

<body>
    <div style="padding: 25px;"><h1>Bienvenido a Mesa-alvas las citas</h1></div>
    
    <form action="PHP/plano.php" method="post">
    <div style="border-left: 2px solid black;">
        <div class="form-container">

            <div class="form-group"><label for="restaurante">Elige un restaurante</label>
                <select name="restaurante" id="restaurante" onchange="actualizarCapacidadMaxima()">
                    <?php
                    $resultados = restaurante();

                    if ($resultados) {
                        foreach ($resultados as $row) {
                            echo "<option value='{$row['restaurante']}'>{$row['restaurante']}</option>";
                        }
                    } else {
                        echo "<option value=''>No hay restaurantes disponibles</option>";
                    }
                    ?>
                </select>
            </div>
            <div class="form-group"><label for="comensales">Numero de comensales</label>
                <input type="number" name="comensales" id="comensales" min="1" max="">
            </div>
            <div class="form-group"><label for="horas">En que turno quieres venir</label>
                <select name="horas" id="horas">
                    <?php
                    $horas = horas();
                    if ($horas) {
                        foreach ($horas as $linea) {
                            echo "<option value='{$linea}'>{$linea}</option>";
                        }
                    } else {
                        echo "<option value=''>No hay horas disponibles</option>";
                    }
                    ?>
                </select>
            </div>
            <div class="form-group"><label for="dia">Y por ultimo que dia vendrias</label>
                <input type="date" name="dia" id="dia" min="<?= date("Y-m-d") ?>">
            </div>
        </div>

        <button type="submit">Enviar</button></div>
    </form>
</body>

</html>