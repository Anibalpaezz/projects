<?php
include("conexion.php");
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $restaurante = $_POST['restaurante'];
    $comensales = $_POST['comensales'];
    $fecha = $_POST['dia'];

    $hora = $_POST['horas'];
    $formato = "H:i:s";
    $hora_time = DateTime::createFromFormat($formato, $hora);

    /* $_SESSION['restaurante'] = $restaurante;
    $_SESSION['comensales'] = $comensales;
    $_SESSION['fecha'] = $fecha;
    $_SESSION['hora'] = $hora; */

    function reservas($restaurante, $fecha)
    {
        try {
            $consulta = conectarBD()->prepare("SELECT * FROM mesa 
        INNER JOIN reservas ON mesa.numMesa = reservas.numMesa 
        WHERE mesa.restaurante = :restaurante AND fecha = :fecha");
            $consulta->bindParam(":restaurante", $restaurante);
            $consulta->bindParam(":fecha", $fecha);
            if ($consulta->execute()) {
                echo "";
            } else {
                echo "Error al consultar las reservas";
            }
        } catch (\Throwable $th) {
            throw $th;
        }

        $reservadas = $consulta->fetchAll(PDO::FETCH_ASSOC);
        return $reservadas;
    }

    function sitios($mesaId)
    {
        try {
            $consulta = conectarBD()->prepare("SELECT capacidad FROM mesa WHERE numMesa = :numMesa");
            $consulta->bindParam(":numMesa", $mesaId);
            $consulta->execute();
        } catch (\Throwable $th) {
            throw $th;
        }

        $sitios = $consulta->fetch(PDO::FETCH_ASSOC);
        return $sitios['capacidad'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../Icon/favicon logo.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/globales.css">
    <link rel="stylesheet" href="../CSS/plano.css">
    <title>Elige las mesa</title>
</head>

<body>
    <h1>Bienvenido a
        <?php echo $_SESSION['restaurante'] ?>
    </h1>
    <div>
        <label for="reservada">Reservada</label>
        <img name="reservada" style="max-width: 35px;" src="../Images/reservada.png" alt="Mesa Reservada">
    </div>
    <div>
        <label for="reservada">Disponible</label>
        <img name="disponible" style="max-width: 35px;" src="../Images/disponible.png" alt="Mesa Disponible">
    </div>
    <br><br><br>
    <form action="confirmacion.php" method="POST">
        <table>
            <?php
            $numFilas = 3;
            $numColumnas = 3;
            for ($i = 0; $i < $numFilas; $i++) {
                echo '<tr>';
                for ($j = 0; $j < $numColumnas; $j++) {
                    $mesaId = $i * $numColumnas + $j + 1;
                    echo '<td>';
                    echo '<input type="radio" name="mesas" value="' . $mesaId . '" id="' . $mesaId . '"';

                    $mesaReservada = true;
                    $resultados = reservas($restaurante, $fecha);
                    foreach ($resultados as $row) {
                        $hora_reservada = new DateTime($row['hora']);
                        $hora_fin = $hora_reservada->add(new DateInterval('PT1H30M'));

                        if ($hora_fin <= $hora_time) {
                            $mesaReservada = false;
                        }
                        if ($row['numMesa'] == $mesaId) {
                            $mesaReservada = false;
                        }
                    }

                    if ($mesaReservada && $comensales <= sitios($mesaId)) {
                        echo '';
                    } else {
                        echo 'style="cursor: not-allowed;" disabled';
                    }

                    echo '>';
                    echo '<label id="fotos" for=' . $mesaId . '>';

                    if ($mesaReservada && $comensales <= sitios($mesaId)) {
                        echo '<img class="disponible" src="../Images/disponible.png" alt="Mesa Disponible">';
                    } else {
                        echo '<img class="reservada" src="../Images/reservada.png" alt="Mesa Reservada">';
                    }
                    echo "<br>";
                    echo 'Mesa ' . $mesaId;
                    echo ' para ' . sitios($mesaId) . ' comensales';

                    echo '</label>';
                    echo '</td>';
                }
                echo '</tr>';
            }
            ?>
        </table>
        <button type="submit">Enviar</button>
    </form>
</body>

</html>