<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo = $_POST['tipo'];

    include "conectar.php";

    try {
        $consulta = "SELECT email FROM informacion";
        $correos = $conexion->prepare($consulta);
        $correos->execute();

        $resultado_correos = $correos->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo 'Excepción: ', $e->getMessage(), "\n";
    }
} else {
    header('location: index.html');
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correos</title>
    <style>
        @import url(https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap);*,body{text-align:center}button,img{cursor:pointer}*{font-family:Archivo Black;font-weight:100;align-items:center}body{background-color:#cab991;color:#333;align-items:center;justify-content:center;margin:0}h1{color:#141414}img{width:100px;height:65px}input[type=radio]{display:none}input[type=radio]:checked+#fotos{border:2px solid #00f}#destinatario,#fotos{display:inline-block;cursor:pointer;margin:5px;padding:5px;border:2px solid #ccc}table{margin-top:15px;margin-left:auto;margin-right:auto}input[type=text],select{width:200px;padding:10px;margin-top:10px}button{background-color:#006400;color:beige;padding:10px;border:none;margin-top:10px}select{width:200px}button:hover{background-color:#030}
    </style>
</head>

<body>
    <h1>Envío de postales</h1>
    <form action="envio.php" method="post">
        <div id="tabla">
            <table>
                <tr>
                    <td>
                        <input type="radio" name="opciones" id="opcion1">
                        <label id="fotos" for="opcion1">
                            <img src="fotos/<?php echo $tipo ?>/1.avif" alt="Foto de <?php echo $tipo ?>">
                        </label>
                    </td>
                    <td>
                        <input type="radio" name="opciones" id="opcion2">
                        <label id="fotos" for="opcion2">
                            <img src="fotos/<?php echo $tipo ?>/2.avif" alt="Foto de <?php echo $tipo ?>">
                        </label>
                    </td>
                    <td>
                        <input type="radio" name="opciones" id="opcion3">
                        <label id="fotos" for="opcion3">
                            <img src="fotos/<?php echo $tipo ?>/3.avif" alt="Foto de <?php echo $tipo ?>">
                        </label>
                    </td>
                    <td>
                        <input type="radio" name="opciones" id="opcion4">
                        <label id="fotos" for="opcion4">
                            <img src="fotos/<?php echo $tipo ?>/4.avif" alt="Foto de <?php echo $tipo ?>">
                        </label>
                    </td>
                    <td>
                        <input type="radio" name="opciones" id="opcion5">
                        <label id="fotos" for="opcion5">
                            <img src="fotos/<?php echo $tipo ?>/5.avif" alt="Foto de <?php echo $tipo ?>">
                        </label>
                    </td>
                </tr>
            </table>
        </div>
        <div id="select">
            <label for="destinatario">Destinatario</label>
                <?php
                if ($correos->rowCount() > 0) {
                    foreach ($resultado_correos as $row) {
                        echo "<input name='destinatario[]' id='destinatario' type='checkbox' value='" . htmlspecialchars($row["email"], ENT_QUOTES) . "'>" . htmlspecialchars($row["email"]);
                    }
                } else {
                    echo "<option value=''>No hay opciones disponibles</option>";
                }

                $conexion = null;
                ?>
            </select>
        </div>
        <div id="tema">Tema: <input type="text" name="tema" id="tema"></div>
        <div id="mensaje">Mensaje: <input type="text" name="mensaje" id="mensaje"></div>
        <input type="hidden" name="src_foto_seleccionada" id="src_foto_seleccionada" value="">
        <input type="hidden" name="tipo" id="tipo" value="<?php echo $tipo?>">
        <div id="boton"><button type="submit">Enviar</button></div>
    </form>

        <script>
    document.addEventListener('DOMContentLoaded', function () {
        function actualizarSrcFotoSeleccionada() {
            var opciones = document.querySelectorAll('input[name="opciones"]');
            for (var i = 0; i < opciones.length; i++) {
                if (opciones[i].checked) {
                    var srcFoto = opciones[i].nextElementSibling.querySelector('img').src;
                    document.getElementById('src_foto_seleccionada').value = srcFoto;
                    break;
                }
            }
        }

        var opciones = document.querySelectorAll('input[name="opciones"]');
        for (var i = 0; i < opciones.length; i++) {
            opciones[i].addEventListener('change', actualizarSrcFotoSeleccionada);
        }
    });

    </script>

</body>

</html>
