<?php
    // Hoja de estilos
    include("estilos.php");
    echo "<div class='container mt-3'><h1 class='display-4'>Datos del permiso</h1><hr class='my-4'>";
    function validacion() {
        // Variables de las validaciones de matricula y fechas
        global $fallos; $matricula = $_POST['matricula']; $llegada = $_POST['fechaInicio']; $ida = $_POST['fechafinal'];
        if (preg_match('/^[0-9]{4}-[A-Za-z]{3}$/', $matricula)) {
            if ($_FILES['certificado']['type'] == "application/pdf") {
                if (preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $llegada) && preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $ida)) return false;

                $fallos .= "El formato de fecha debe ser YYYY-MM-DD<br>";
                return $fallos;
            }
            $fallos .= "Solo se puede subir ficheros tipo pdf<br>";
            return $fallos;
        }
        $fallos .= "Matrícula erronea<br>";
        return $fallos;
    }

    if(empty($_POST['pricipal'])) $mensaje=validacion();

    if(!empty($_POST['pricipal']) || !empty($_POST['general'])){
        // Variables de fallos en la eleccion de tipos de permiso 
        $corregir = true; $eleccion = $_POST['opcion'];
        $formulario = "
            <form action='tipo.php' method='post' enctype='multipart/form-data' class='mt-4'>
                <label class='mt-2'>Matricula :</label><br>
                <input type='text' name='matricula' value='" . $_POST['matricula'] . "' class='form-control'> <br>";

        if(empty($_POST['matricula'])) $corregir = false;

        // Eleccion de tipos de permiso
        if($eleccion=="vehiculosEMT"){
            $formulario .="
                <label>Calle: </label><br>
                <input type='text' name='calle' value = '".$_POST['calle']."'class='form-control'><br>";

            if(empty($_POST['calle'])) $corregir=false;

        } else if($eleccion=="taxis" ) {
            $formulario .=  "
                <label>Nombre del propietario: </label><br>
                <input type='text' name='propietario' value ='".$_POST['propietario']."'class='form-control'><br>";
            if(empty($_POST['propietario'])) $corregir=false;

        } else if($eleccion=="servicios" ) {
            $formulario .= "
                <label>Tipo de vehiculo: </label><br>
                <input type='text' name='tipo_vehiculo' value ='".$_POST['tipo_vehiculo']."'class='form-control'> <br>";
            if(empty($_POST['tipo_vehiculo'])) $corregir=false;

        } else if($eleccion=="residentesYHoteles") {
            $formulario .= "<label>direccion :</label><br>
                            <input type='text' name='direccion' value ='" . $_POST['direccion'] . "'class='form-control'><br>
                            <label>Fecha de inicio :</label><br>
                            <input type='text' name='fechaInicio' value ='" . $_POST['fechaInicio'] . "'class='form-control'><br>
                            <label>Fecha final :</label><br>
                            <input type='text' name='fechafinal' value = '" . $_POST['fechafinal'] . "'class='form-control'><br>";
            if(empty($_POST['direccion']) || empty($_POST['fechaInicio'])|| empty($_POST['fechafinal']))$corregir=false; 
        } else if($eleccion=="logistica"){
            $formulario .= "<label class='mt-2'>Empresa :</label><br><input type='text' name='empresa' value ='" . $_POST['empresa'] . "' class='form-control'><br>";
            if(empty($_POST['empresa'])) $corregir=false;
        }

        $formulario .= "
                            <label class='mt-2'>Certificado :</label>
                            <input type='file' name='certificado' class='form-control'><br>
                            <input type='submit' name='general' value='Enviar' class='btn btn-primary'>
                            <input type='button' onClick='history.go(-1)' value='Volver' class='btn btn-danger'>
                            <input type='button' onClick='history.go(-2)' value='A casa' class='btn btn-success'>
                            <br>" . $mensaje . "
                        </form></div>";

        if(!$corregir || !$mensaje) echo $formulario;
        else {
            function validarmatricula($file, $matricula){
                while(!feof($file)){
                    $matruculaaux = substr(fgets($file),0,8);
                    if($matruculaaux==$matricula) return false;
                } return true;
            }
                $validar = true;
                if($_FILES['certificado']['type']=="application/pdf"){
                    if (is_uploaded_file($_FILES['certificado']['tmp_name'])) {
                        //Variables de la ubicacion del directorio
                        $nombreDirectorio = "./pdf/"; $nombreFichero = $_FILES['certificado']['name'];
                        $nombreCompleto = $nombreDirectorio . $nombreFichero;

                        if (is_dir($nombreDirectorio)) {
                            $nombreCompleto = $nombreDirectorio . $nombreFichero;
                            move_uploaded_file($_FILES['certificado']['tmp_name'], $nombreCompleto);
                            echo "<input type='button' onClick='history.go(-3)' value='A casa' class='btn btn-success'><br>
                            Fichero subido con el nombre: $nombreFichero<br>";
                        } else {
                            echo 'Directorio definitivo inválido';
                            $validar=false;
                        }
                    } else {
                        print("No se ha podido subir el fichero");
                        $validar=false;
                    }
                }
                else $validar=false;

                // Lectura de ficheros txt de los diferentes tipos de certificado
                if($validar){
                    $matricula = $_POST['matricula'];
                    $matricula = strtoupper($matricula);
                    if(!empty($_POST['calle'])){
                        if($file = fopen('ficheros/vehiculosEMT.txt' , 'r+')){
                            $respuesta = validarmatricula($file, $matricula);
                            fclose($file);
                            if($respuesta){
                                $calle = $_POST['calle'];
                                $escribir = fopen('ficheros/vehiculosEMT.txt' , 'a+');
                                fwrite($escribir,$matricula." ".$calle."\r\n");
                                fclose($escribir);
                            } else echo "ya esta registrado esa matricula";
                        } else die("no se puedo acceder a fichero");
                    }else if(!empty($_POST['propietario'])){
                        if($file = fopen('ficheros/taxis.txt' , 'r+')){
                            $respuesta = validarmatricula($file, $matricula);
                            fclose($file);
                            if($respuesta){
                                $propietario = $_POST['propietario'];
                                $escribir = fopen('ficheros/taxis.txt' , 'a+');
                                fwrite($escribir,$matricula." ".$propietario."\r\n");
                                fclose($escribir);
                            } else echo "ya esta registrado esa matricula";
                        } else die("no se puedo acceder a fichero");
                    } else if(!empty($_POST['tipo_vehiculo'])){
                        if($file = fopen('ficheros/servicios.txt' , 'r+')){
                            $respuesta = validarmatricula($file, $matricula);
                            fclose($file);
                            if($respuesta){
                                $tipo_vehiculo = $_POST['tipo_vehiculo'];
                                $escribir = fopen('ficheros/servicios.txt' , 'a+');
                                fwrite($escribir,$matricula." ".$tipo_vehiculo."\r\n");
                                fclose($escribir);
                            }else echo "ya esta registrado esa matricula";
                        } else die("no se puedo acceder a fichero");
                    } else if(!empty($_POST['direccion'])){
                        if($file = fopen('ficheros/residentesYHoteles.txt' , 'r+')){
                            $respuesta = validarmatricula($file, $matricula);
                            fclose($file);
                            if($respuesta){
                                $direccion = $_POST['direccion'];
                                $llegada = $_POST['fechaInicio'];
                                $ida = $_POST['fechafinal'];
                                $escribir = fopen('ficheros/residentesYHoteles.txt' , 'a+');
                                fwrite($escribir,$matricula." ".$direccion. " " . $llegada. " " .$ida."\r\n");
                                fclose($escribir);
                            } else echo "ya esta registrado esa matricula";
                        } else die("no se puedo acceder a fichero");
                    } else if(!empty($_POST['empresa'])){
                        if($file = fopen('ficheros/logistica.txt' , 'r+')){
                            $respuesta = validarmatricula($file, $matricula);
                            fclose($file);
                            if($respuesta){
                                $empresa = $_POST['empresa'];
                                $escribir = fopen('ficheros/logistica.txt' , 'a+');
                                fwrite($escribir,$matricula." ".$empresa."\r\n");
                                fclose($escribir);
                            } else echo "Ya se ha registrado esa matricula";
                        } else die("no se puedo acceder a fichero");
                    } else echo "Fallo 1";
                } else echo "Fallo 2";
        }
    }
?>