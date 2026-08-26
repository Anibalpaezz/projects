<?php
include("conexion.php");

session_start();
if (!isset($_SESSION['usuario'])) {
    header('Location: ../index.html');
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $coste = $conexion->prepare("SELECT SUM(productos.precio * item_cesta.cantidad) FROM productos INNER JOIN item_cesta ON productos.producto_ID = item_cesta.producto_ID INNER JOIN cesta ON item_cesta.cesta_ID = cesta.cesta_ID WHERE email = :usuario;");
    $coste->bindParam(":usuario", $_SESSION['usuario']);

    if ($coste->execute()) {
        $primera_compra = $conexion->prepare("SELECT email FROM pedidos WHERE email = :usuario");
        $primera_compra->bindParam(":usuario", $_SESSION["usuario"]);

        if ($primera_compra->execute()) {
            if ($primera_compra->rowCount() == 0) {
                $precio_original = $coste->fetchColumn();
                $descuento = $precio_original * 0.35;
                $suma = $precio_original - $descuento;
                number_format($suma, 2);
            } else {
                $suma = $coste->fetchColumn();
            }
        } else {
            echo "Error al sacar si es primera compra";
        }

        $fecha_actual = (new DateTime('now'))->format('Y-m-d');
        $fecha_prevista = (new DateTime('now'))->add(new DateInterval('P5D'))->format('Y-m-d');

        $pedido = $conexion->prepare("INSERT INTO pedidos (email, fecha_pedido, fecha_entrega, total_pedido, entregado) VALUES (:usuario, :fecha_actual, :fecha_prevista, :suma, false)");
        $pedido->bindParam(':usuario', $_SESSION['usuario']);
        $pedido->bindParam(':fecha_actual', $fecha_actual);
        $pedido->bindParam(':fecha_prevista', $fecha_prevista);
        $pedido->bindParam(':suma', $suma);

        if ($pedido->execute()) {
            $pedido_id = $conexion->prepare("SELECT pedido_id FROM pedidos WHERE email = :usuario");
            $pedido_id->bindParam(":usuario", $_SESSION["usuario"]);


            if ($pedido_id->execute()) {
                $id = $pedido_id->fetchColumn();

                $item_pedido = $conexion->prepare("INSERT INTO item_pedido (pedido_ID, producto_ID, unidades) SELECT :id, producto_ID, SUM(cantidad) FROM item_cesta INNER JOIN cesta ON item_cesta.cesta_ID = cesta.cesta_ID WHERE email = :usuario GROUP BY producto_ID");
                $item_pedido->bindParam(":id", $id);
                $item_pedido->bindParam(":usuario", $_SESSION['usuario']);

                if ($item_pedido->execute()) {
                    $borrar_cesta = $conexion->prepare("DELETE FROM cesta WHERE email = :usuario");
                    $borrar_cesta->bindParam(":usuario", $_SESSION['usuario']);

                    if ($borrar_cesta->execute()) {
                        require('pdf.php');

                        $pdf = new PDF();
                        $pdf->generatePDF();
                        $pdf->Output('../PDF/' . $aleatorio_factura, 'S');

                        require "correos.php";

                        if (enviarmail()) {
                            echo 'Correo enviado correctamente.';
                        } else {
                            echo 'Error al enviar el correo.';
                        }
                    } else {
                        echo "Error en el borrado de cesta";
                    }
                } else {
                    echo "Error en la insercion a item pedido";
                }
            } else {
                echo "Error en la la consulta de pedido_ID";
            }
        } else {
            echo "Error en la insercion a pedido";
        }
    } else {
        echo "Error en la consulta de precio";
    }
} else {
    echo "Error no se llega por get";
}
?>