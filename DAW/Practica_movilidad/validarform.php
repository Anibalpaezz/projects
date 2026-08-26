<?php
// Hoja de estilos
include("estilos.php");

function buscar($file, $matricula, $ida) {
    if ($file = fopen($file, 'r+')) {
        while (!feof($file)) {
            $linea = fgets($file);
            $array_linea = explode(" ", $linea);
            if ($array_linea[0] == $matricula) {
                if ($file == 'ficheros/residentesYHoteles.txt') {
                    $fecha_de_hoteles = explode("/", $array_linea[3]);
                    $fecha_de_vehiculos = explode("-", $ida);
                    $validarfecha = true;
                    for ($ind = 0; $ind < 3; $ind++) {
                        if ((int)$fecha_de_hoteles[$ind] < (int)$fecha_de_vehiculos[$ind]) return false;

                    } return true;

                } else return true;
            }
        } return false;

    } else die("no se puedo acceder a fichero de base de datos");

}

if (!empty($_POST['pricipal'])) {
    $eleccion = $_POST['opcion'];
    if ($eleccion == "a") {
        $formulario .= "<form action='tipo.php' method='post'>
        <label>TIPO DE CERTIFICADO:</label>
        <select name='opcion'>
            <option value='vehiculosEMT'> vehiculosEMT</option>
            <option value='taxis'> taxis</option>
            <option value='servicios'> servicios</option>
            <option value='residentesYHoteles'> residentesYHoteles</option>
            <option value='logistica'> logistica</option>
        </select>
        <br>
        <button type='submit' name='pricipal' value='pricipal' class='btn btn-primary'>Enviar</button>
        </form>";

        echo "<div class='container mt-4'> <h1>TIPO</h1> <hr>";
        echo $formulario;

    } else {
        echo "<div class='container mt-4'>
            <h1>INFRACTORES</h1>
            <a href='index.html' class='btn btn-primary'>Inicio</a>
            <hr>";

        //Variables para el numero de infractores y array de los infractores
        $infractores = 0; $array_infractores = Array();
        $ruta = Array('ficheros/logistica.txt', 'ficheros/residentesYHoteles.txt', 'ficheros/servicios.txt', 'ficheros/taxis.txt', 'ficheros/vehiculosEMT.txt');

        // Generar una tabla para los delincuentes
        if ($file = fopen('ficheros/vehiculos.txt', 'r+')) {
            echo "<table class='table table-bordered'> <thead> <tr> <th scope='col'>Matrículas Infractoras</th></tr></thead> <tbody>";
            $valido = true;
            while (!feof($file)) {
                $valido = true;
                $linea = fgets($file);
                $array_linea = explode(" ", $linea);
                if (strcasecmp(trim($array_linea[5]), "electrico") == 0) {
                    $valido = false;
                }

                if (array_search($array_linea[0], $array_infractores) != null) {
                    $valido = false;
                } else {
                    for ($ind = 0; $ind < 5 && $valido; $ind++) {
                        if (buscar($ruta[$ind], $array_linea[0], $array_linea[3])) {
                            $valido = false;
                        }
                    }

                    if ($valido) {
                        echo "<tr> <td>" . $array_linea[0] . "</td></tr>";
                        $infractores++;
                        array_unshift($array_infractores, $array_linea[0]);
                    }

                }

            }echo "</tbody></table>";

        } else die("No se ha podido puedo acceder a fichero");

        echo "<br><br><br>";
        echo "Número de infractores: " . $infractores . "</div>";
    }
} else echo "error 404";

?>

