<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo = $_POST['tipo'];
    $nombreFotoSeleccionada = $_POST['src_foto_seleccionada'];
    $destinatario = $_POST['destinatario'];
    $asunto = $_POST['tema'];
    $mensaje = $_POST['mensaje'];

    if (empty($tipo)) {
        $errores[] = "Error de tipo";
    } else if (empty($nombreFotoSeleccionada)) {
        $errores[] = "Error de URL de la foto";
    } else if (empty($destinatario)) {
        $errores[] = "Error de destinatario";
    } else if (empty($asunto)) {
        $errores[] = "Error de asunto";
    } else if (empty($mensaje)) {
        $errores[] = "Error de mensaje";
    }


    require "/var/www/html/ejer_mail/PHPMailer-master/src/PHPMailer.php";
    require "/var/www/html/ejer_mail/PHPMailer-master/src/SMTP.php";



    $smtpServidor = "localhost";
    $smtpUsuario = "nico@troyan";
    $smtpClave = "nico1234";
    $smtpPuerto = 25;

    $mail = new PHPMailer();

        $mail->isSMTP();
        $mail->Mailer = "SMTP";
        $mail->SMTPAutoTLS = true;
        $mail->isHTML(true);
        $mail->Port = 25;
        $mail->Host = "localhost";
        $mail->SMTPAuth = true;
        $mail->Username = "nico@troyan.com";
        $mail->Password = "nico1234";
        $mail->From = "nico@troyan.com";
        $mail->FromName = "yo";


        
        

        foreach ($destinatario as $correos) {
            $mail->ClearAddresses();
            $mail->addAddress($correos);

            if ($tipo == "Cumpleaños") {
                $mail->Subject = 'Feliz cumpleaños';
            } else if ($tipo == "Navidad") {
                $mail->Subject = 'Felices fiestas';
            } else if ($tipo == "Vienna") {
                $mail->Subject = 'Recuerdos de Vienna';
            } else if ($tipo == "Pelis") {
                $mail->Subject = 'Te recomiendo esta peli';
            }

            
        $mail->Body = '<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Postal de Ejemplo</title>
            <style>
            body{margin:0;padding:0;background-color:#f8f8f8}.postcard{max-width:400px;margin:20px auto;background-color:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1);overflow:hidden}.postcard img{width:100%;height:auto;border-radius:10px 10px 0 0}.postcard .content{padding:20px}.postcard h2{color:#333}.postcard p{color:#666}
            </style>
        </head>
        <body>
        
            <div class="postcard">
                <img src="' . $nombreFotoSeleccionada .'" alt="Imagen de la postal">
                <div class="content">
                    <h2>' . $asunto .'</h2>
                    <p>' . $mensaje . '</p>
                </div>
            </div>
        
        </body>
        </html>
        ';

            if ($mail->send()) {
                echo 'Correo enviado correctamente.';
                
            } else {
                echo 'Error al enviar el correo: ', $mail->ErrorInfo;
            }
        }
        

        
        
    /* } catch (Exception $e) {
        echo 'Error al enviar el correo: ', $mail->ErrorInfo;
    } */
} else {
    header('location: index.html');
}



