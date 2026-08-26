<?php
require('../PDF/Generador/fpdf.php');

class PDF extends FPDF
{
    function Header()
    {
        $this->SetFont('Arial', 'B', 28);
        $this->Cell(50, 10, 'Jaboneria Scarlatti', 0, 0);
        $this->Image('../Logo/IES logo.png', 180, 5, 20);

        $this->Ln(20);
    }

    function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, 'Gracias por confiar en nosotros', 0, 0, 'C');
    }

    function generatePDF()
    {
        include("conexion.php");
        $consulta_nombre = $conexion->prepare("SELECT nombre FROM clientes WHERE email = :usuario");
        $consulta_nombre->bindParam(':usuario', $_SESSION['usuario']);

        if ($consulta_nombre->execute()) {
            $resultado_nombre = $consulta_nombre->fetchColumn();

            $consulta_dir = $conexion->prepare("SELECT direccion FROM clientes WHERE email = :usuario");
            $consulta_dir->bindParam(':usuario', $_SESSION['usuario']);


            if ($consulta_dir->execute()) {
                $resultado_dir = $consulta_dir->fetchColumn();

                $consulta_coste = $conexion->prepare("SELECT total_pedido FROM pedidos WHERE email = :usuario");
                $consulta_coste->bindParam(':usuario', $_SESSION['usuario']);

                if ($consulta_coste->execute()) {
                    $resultado_coste = $consulta_coste->fetchColumn();

                    $subtotal = $resultado_coste;
                    $subtotal = number_format($subtotal, 2);
                    $IVA = $subtotal * 0.21;
                    $IVA = number_format($IVA, 2);
                    $gestion = $subtotal / 10;
                    $gestion = number_format($gestion, 2);
                    $coste_total = $subtotal + $IVA + $gestion;
                    $coste_total = number_format($coste_total, 2);
                    $fecha_actual = new DateTime('now');
                    $aleatorio_factura = rand(1, 10000);

                    $this->AddPage();
                    $this->SetAutoPageBreak(true, 15);

                    $this->SetFont('Arial', '', 11);
                    $this->Cell(50, 10, 'Nombre: ' . $resultado_nombre, 0, 0);
                    $this->Cell(0, 10, 'Direccion: ' . $resultado_dir, 0, 1);
                    $this->Cell(50, 10, 'Fecha: ' . $fecha_actual->format('d-m-Y'), 0, 0);
                    $this->Cell(0, 10, 'Numero de Factura: ' . $aleatorio_factura . $fecha_actual->format('y'), 0, 1);

                    $this->Cell(50, 10, 'Descripcion del producto', 1, 0);
                    $this->Cell(40, 10, 'Cantidad', 1, 0);
                    $this->Cell(40, 10, 'Precio', 1, 1);

                    $articulos = $conexion->prepare("SELECT productos.nombre, item_pedido.unidades, productos.precio FROM item_pedido INNER JOIN productos ON item_pedido.producto_ID = productos.producto_ID INNER JOIN pedidos ON item_pedido.pedido_ID = pedidos.pedido_ID WHERE pedidos.email = :usuario");
                    $articulos->bindParam(':usuario', $_SESSION['usuario']);

                    if ($articulos->execute()) {
                        while ($row = $articulos->fetch(PDO::FETCH_ASSOC)) {
                            $this->Cell(50, 10, $row['nombre'], 1, 0);
                            $this->Cell(40, 10, $row['unidades'], 1, 0);

                            $primera_compra = $conexion->prepare("SELECT email FROM pedidos WHERE email = :usuario");
                            $primera_compra->bindParam(":usuario", $_SESSION["usuario"]);

                            if ($primera_compra->execute()) {
                                if ($primera_compra->rowCount() == 1) {
                                    $precio_original = $row['precio'];
                                    $descuento = $precio_original * 0.35;
                                    $final = $precio_original - $descuento;
                                    number_format($suma, 2);
                                    $this->Cell(40, 10, number_format($final, 2), 1, 1);
                                } else {
                                    $this->Cell(40, 10, number_format($row['precio'], 2), 1, 1);
                                }
                            } else {
                                echo "Error al sacar si es primera compra";
                            }
                        }

                        $this->Cell(50, 10, 'Subtotal', 1, 0);
                        $this->Cell(80, 10, $subtotal, 1, 1, 'C');

                        $this->Cell(50, 10, 'IVA 21%', 1, 0);
                        $this->Cell(80, 10, $IVA, 1, 1, 'C');

                        $this->Cell(50, 10, 'Gastos de gestion', 1, 0);
                        $this->Cell(80, 10, $gestion, 1, 1, 'C');

                        $this->Cell(50, 10, 'Coste total', 1, 0);
                        $this->Cell(80, 10, $coste_total, 1, 1, 'C');

                        $this->Output();
                    } else {
                        echo "Error al obtener los articulos";
                    }
                } else {
                    echo "Error al obtener el coste del pedido";
                }
            } else {
                echo "Error al obtener la direccion del cliente";
            }
        } else {
            echo "Error al obtener el nombre del cliente";
        }
    }
}
?>