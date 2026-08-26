<?php
include("conexion.php");

session_start();
if (!isset($_SESSION['usuario'])) {
     header('Location: ../index.html');
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
     $producto = $_POST["producto"];
     $cantidad = $_POST["cantidad"];
     if ($cantidad == 0) {
          echo "<h2>Solo puedes comprar 2 jabones por mes si quieres mas vete a Zara Home";
     } else {
          $dia_actual = (new DateTime('now'))->format('Y-m-d');

          $cesta_unica = $conexion->prepare("SELECT email FROM cesta where email like :usuario");
          $cesta_unica->bindParam(":usuario", $_SESSION['usuario']);

          if ($cesta_unica->execute()) {
               if ($cesta_unica->rowCount() > 0) {
                    $cesta_id = $conexion->prepare("SELECT cesta_ID FROM cesta WHERE email = :usuario");
                    $cesta_id->bindParam(":usuario", $_SESSION['usuario']);

                    if ($cesta_id->execute()) {
                         $resul_cesta_id = $cesta_id->fetchColumn();

                         $inser_item_cesta = $conexion->prepare("INSERT INTO item_cesta (cesta_ID, producto_ID, cantidad) VALUES (:cesta_ID, :producto, :cantidad)");
                         $inser_item_cesta->bindParam(':cesta_ID', $resul_cesta_id);
                         $inser_item_cesta->bindParam(':producto', $producto);
                         $inser_item_cesta->bindParam(':cantidad', $cantidad);

                         if ($inser_item_cesta->execute()) {
                              header('Location: carrito.php?producto=' . urlencode($producto));
                         } else {
                              echo "Error al ejecutar insert en item cesta";
                         }
                    } else {
                         echo "Error en la consulta de cesta id.";
                    }
               } else if ($cesta_unica->rowCount() == 0) {
                    $inser_cesta = $conexion->prepare("INSERT INTO cesta (email, fecha_creacion) VALUES (:usuario, :fecha_creacion)");
                    $inser_cesta->bindParam(':usuario', $_SESSION['usuario']);
                    $inser_cesta->bindParam(':fecha_creacion', $dia_actual);

                    if ($inser_cesta->execute()) {
                         $cesta_id = $conexion->prepare("SELECT cesta_ID FROM cesta WHERE email = :usuario");
                         $cesta_id->bindParam(":usuario", $_SESSION['usuario']);

                         if ($cesta_id->execute()) {
                              $resul_cesta_id = $cesta_id->fetchColumn();

                              $inser_item_cesta = $conexion->prepare("INSERT INTO item_cesta (cesta_ID, producto_ID, cantidad) VALUES (:cesta_ID, :producto, :cantidad)");
                              $inser_item_cesta->bindParam(':cesta_ID', $resul_cesta_id);
                              $inser_item_cesta->bindParam(':producto', $producto);
                              $inser_item_cesta->bindParam(':cantidad', $cantidad);

                              if ($inser_item_cesta->execute()) {
                                   header('Location: carrito.php?producto=' . urlencode($producto));
                              } else {
                                   echo "mal final";
                              }
                         } else {
                              echo "Error en la consulta de cesta id.";
                         }
                    } else {
                         echo "Error en insertar a cesta: " . $inser_cesta->errorInfo()[2];
                    }
               } else {
                    echo "Error en la devolucion de campos";
               }
          } else {
               echo "Error en la consulta de cesta unica";
          }
     }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="shortcut icon" href="../Icon/favicon logo.png" type="image/x-icon">
     <title>Enjabon-arte</title>
     <link rel="stylesheet" href="../CSS/global.css">
     <link rel="stylesheet" href="../CSS/añadido.css">
</head>

<body>
     <h1>Carrito de
          <?php
          include "conexion.php";

          $nombre_carrito = $conexion->prepare("SELECT nombre FROM clientes WHERE email = :usuario");
          $nombre_carrito->bindParam(":usuario", $_SESSION['usuario']);

          if ($nombre_carrito->execute()) {
               $resultado_nombre = $nombre_carrito->fetchColumn();
               echo $resultado_nombre;
          } else {
               echo "Error al buscar el nombre";
          }
          ?>
     </h1>
     <?php
     if (isset($_GET['producto'])) {
          $productoId = $_GET['producto'];

          $produc_carrito = $conexion->prepare("SELECT nombre, precio, imagen FROM productos INNER JOIN item_cesta ON productos.producto_ID = item_cesta.producto_ID WHERE productos.producto_ID = :producto");
          $produc_carrito->bindParam(':producto', $productoId);
          $produc_carrito->execute();

          if ($produc_carrito->rowCount() > 0) {

               while ($row = $produc_carrito->fetch(PDO::FETCH_ASSOC)) {
                    echo '<h2>Los siguientes productos se añadieron a su cesta</h2>';
                    echo '<div>';
                    echo '<a href="mostrar_jabon.php?id=' . $row['producto_ID'] . '" class="soap-link">';
                    echo '<div class="soap-box">';
                    echo '<img src="' . $row['imagen'] . '" alt="' . $row['nombre'] . '" class="soap-image"><br>';
                    echo '<strong>' . $row['nombre'] . " " . '</strong>';

                    $primera_compra = $conexion->prepare("SELECT email FROM pedidos WHERE email = :usuario");
                    $primera_compra->bindParam(":usuario", $_SESSION["usuario"]);
                    $primera_compra->execute();
                    if ($primera_compra->rowCount() == 0) {
                         $precio_original = $row['precio'];
                         $descuento = $precio_original * 0.35;
                         $precio_con_descuento = $precio_original - $descuento;

                         echo '<del>' . $precio_original . '</del> ' . number_format($precio_con_descuento, 2) . '€';
                    } else {
                         echo $row['precio'] . '€';
                    }

                    echo '</div>';
                    echo '</a>';
                    echo '</div>';
               }
          } else {
               echo 'Error en la muestra del carrito';
          }
     } else {
          $produc_carrito = $conexion->prepare("SELECT nombre, precio, imagen FROM productos INNER JOIN item_cesta ON productos.producto_ID = item_cesta.producto_ID inner join cesta on item_cesta.cesta_ID = cesta.cesta_ID where email = :usuario");
          $produc_carrito->bindParam(':usuario', $_SESSION['usuario']);
          $produc_carrito->execute();

          if ($produc_carrito->rowCount() > 0) {
               echo '<div>';
               while ($row = $produc_carrito->fetch(PDO::FETCH_ASSOC)) {
                    echo '<a href="mostrar_jabon.php?id=' . $row['producto_ID'] . '" class="soap-link">';
                    echo '<div class="soap-box">';
                    echo '<img src="' . $row['imagen'] . '" alt="' . $row['nombre'] . '" class="soap-image"><br>';
                    echo '<strong>' . $row['nombre'] . " " . '</strong>';

                    $primera_compra = $conexion->prepare("SELECT email FROM pedidos WHERE email = :usuario");
                    $primera_compra->bindParam(":usuario", $_SESSION["usuario"]);
                    $primera_compra->execute();
                    if ($primera_compra->rowCount() == 0) {
                         $precio_original = $row['precio'];
                         $descuento = $precio_original * 0.35;
                         $precio_con_descuento = $precio_original - $descuento;

                         echo '<del>' . $precio_original . '</del> ' . number_format($precio_con_descuento, 2) . '€';
                    } else {
                         echo $row['precio'] . '€';
                    }

                    echo '</div>';
                    echo '</a>';
               }
               echo '</div>';
          } else {
               echo "No se encontraron jabones en la base de datos.";
          }
     }
     ?>
     <div>
          <a href="productos-login.php"><button>Seguir comprando</button></a>
          <a href="comprar.php"><button>Finalizar compra</button></a>
          <a href="borra_carrito.php"><button>Eliminar del carrito</button></a>
     </div>
</body>

</html>