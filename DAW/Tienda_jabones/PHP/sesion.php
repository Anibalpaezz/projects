<?php
include("conexion.php");

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["usuario"])) {
        $usuario = $_POST["usuario"];
    }

    if (isset($_POST["pass"])) {
        $pass = $_POST["pass"];
    }

    function correo($usuario) {
        $patron_correo = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/';

        return preg_match($patron_correo, $usuario);
    }

    function nombre($usuario) {
        $patron_nombre = '/^[A-Zasession_start();
        -z\s]+$/';

        return preg_match($patron_nombre, $usuario);
    }

    if (correo($usuario)) {
        $consulta = $conexion->prepare("SELECT * FROM clientes WHERE email = ? AND pass = ?");

        try {
            $consulta->bindParam(1, $usuario);
            $consulta->bindParam(2, $pass);

            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

            if ($resultado) {
                echo "bien correo";
                header("Location: productos-login.php");
                $_SESSION['permisos'] = 0;
                $_SESSION['usuario'] = $usuario;
                $_SESSION['carrito'] = array();
            } else {
                echo "mal correo";
                header("Location: ../index.html");
            }
        } catch (PDOException $e) {
            die("Error en la consulta: " . $e->getMessage());
        }
    } else if (nombre($usuario)) {
        $consulta = $conexion->prepare("SELECT * FROM administradores WHERE usuario = ? AND pass = ?");

        try {
            $consulta->bindParam(1, $usuario);
            $consulta->bindParam(2, $pass);

            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

            if ($resultado) {
                echo "bien user";
                header("Location: productos-login.php");
                $_SESSION['permisos'] = 1;
                $_SESSION['usuario'] = $usuario;
                $_SESSION['carrito'] = array();
            } else {
                echo $error_message = "Credenciales no válidas. Inténtalo de nuevo.";
            }
        } catch (PDOException $e) {
            die("Error en la consulta: " . $e->getMessage());
        }
    } else {
        echo "Todo mal";
    }
}
