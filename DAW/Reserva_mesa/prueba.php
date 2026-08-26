<?php

$fechaStr = "12:30:45";
$formato = "H:i:s";

$fechaDatetime = DateTime::createFromFormat($formato, $fechaStr);

if ($fechaDatetime !== false) {
    $fechaDatetime->add(new DateInterval('PT1H30M'));
    echo $fechaDatetime->format('H:i:s');
} else {
    echo "Error en el formato de la fecha.";
}

