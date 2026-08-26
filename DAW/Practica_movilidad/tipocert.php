<?php
    // Hoja de estilos
    include("estilos.php");

    // Funcion para buscar la matricula en los ficheros
    function buscar($file, $matricula) {
        if ($file = fopen($file, 'r+')) {
            while (!feof($file)) {
                $linea = fgets($file);
                $array_linea = explode(" ", $linea);
                if ($array_linea[0] == $matricula) return false;

            } return true;

        } else die("No se pudo acceder al fichero de la base de datos");   
    }

    if (!empty($_POST['pricipal'])) {
        $eleccion = $_POST['opcion'];
        if ($eleccion == "a") {
            $formulario = "
            <h1 class='h1 text-center'>Acción a realizar</h1>
            <hr>
            <form action='tipo.php' method='post'>
            <select name='opcion' class='form-select'>
                <option value='vehiculosEMT'>Vehiculos EMT</option>
                <option value='taxis' selected>Taxis</option>
                <option value='servicios'>Servicios</option>
                <option value='residentesYHoteles'>Residentes y Hoteles</option>
                <option value='logistica'>Logistica</option>
            </select>
            <input type='submit' name='pricipal' value='Enviar' class='btn btn-primary'>
            <input type='button' onClick='history.go(-1)' value='Volver' class='btn btn-danger'>
            </form>";
        echo "<div class='container mt-3'>$formulario</div>";
        } else {

            // Tabla de los delincuentes
            $delincuentes = 0; $array_delincuentes = Array();
            $ruta = Array('ficheros/logistica.txt', 'ficheros/residentesYHoteles.txt', 'ficheros/servicios.txt', 'ficheros/taxis.txt', 'ficheros/vehiculosEMT.txt');
            if ($file = fopen('ficheros/vehiculos.txt', 'r+')) {
                echo "<div class='container mt-3'>
                    <table class='table table-bordered';>
                        <thead>
                            <tr>
                                <th class='text-center'>Matriculas de los infractores</th>
                            </tr> </thead> <tbody>";
                            
                $valido = true;
                while (!feof($file)) {
                    $valido = true;
                    $linea = fgets($file);
                    $array_linea = explode(" ", $linea);
                    if (strcasecmp(trim($array_linea[5]), "electrico") == 0) {
                    } else {
                        for ($ind = 0; $ind < 5 && $valido; $ind++) {
                            if (array_search($array_linea[0], $array_delincuentes) != null) {
                                $valido = false;
                            } else if (buscar($ruta[$ind], $array_linea[0])) {
                                $valido = false;
                                echo "<tr><td>" . $array_linea[0] . "</td></tr>";
                                $delincuentes++;
                                array_unshift($array_delincuentes, $array_linea[0]);
                            }
                        }
                    }
                }

                echo "</tbody> </table> </div>";

            } else die("No se ha podido acceder al fichero");

            echo "<div class='container mt-3'>Delincuentes: " . $delincuentes. "<br><input type='button' onClick='history.go(-1)' value='A casa' class='btn btn-success'></div>";
        }
    }
    ?>