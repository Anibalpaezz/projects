<?php
function enviarmail()
{
    require("../Mail/src/PHPMailer.php");
    require("../Mail/src/SMTP.php");

    $smtpServidor = "localhost";
    $smtpUsuario = "nico@troyan";
    $smtpClave = "nico";
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
    $mail->Password = "nico";
    $mail->From = "nico@troyan.com";
    $mail->Subject = "Factura simplificada";
    $mail->FromName = "Jaboneria Scarlatti";
    $mail->addAddress("justin@troyan.com");

    $mail->Body = "Copia de la factura generada automaticamente";

    $mail->addStringAttachment('../PDF/' . $aleatorio_factura, 'Factura' . $aleatorio_factura . '.pdf');

    if ($mail->send()) {
        return true;
    }
    return false;

}