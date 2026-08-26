package geselectrera.datos;

import geselectrera.negocio.*;
import java.time.LocalDate;

/**
 * Stub de la capa de Datos.
 *
 * En un sistema real, esta clase se conectaría a una base de datos
 * o a un sistema de archivos para cargar y guardar los datos.
 * En esta versión, proporciona datos de prueba predefinidos
 * para facilitar las pruebas del sistema sin necesidad de
 * introducir datos manualmente en cada ejecución.
 *
 * Este stub sustituye a la capa de persistencia real, permitiendo
 * probar la capa de negocio de forma aislada.
 */
public class DatosStub {

    /**
     * Carga datos de prueba en el gestor de electrolineras.
     * Crea electrolineras, configura puntos de recarga y
     * registra reservas de ejemplo.
     *
     * @param gestor El gestor de electrolineras donde cargar los datos
     */
    public static void cargarDatosPrueba(GestorElectrolineras gestor) {

        // --- Electrolinera 1: "E.S. Nueva Carga" ---
        Electrolinera e1 = new Electrolinera(1, "E.S. Nueva Carga",
                5, 5, 2, TipoEstacion.MIXTA, 41.666135, -3.720922);
        gestor.setElectrolinera(1, e1);

        // Configurar puntos de recarga
        e1.getPuntoRecarga(1).configurar("AC", 3, 30);    // Nivel 1
        e1.getPuntoRecarga(2).configurar("AC", 22, 15);   // Nivel 2
        e1.getPuntoRecarga(3).configurar("AC", 4, 30);    // Nivel 1
        e1.getPuntoRecarga(4).configurar("DC", 75, 10);   // Nivel 3
        e1.getPuntoRecarga(5).configurar("AC", 11, 15);   // Nivel 2

        // Reservas en el punto 4 (Nivel 3) - noviembre 2025
        int contador = 0;
        e1.getPuntoRecarga(4).reservar(LocalDate.of(2025, 11, 2), 7, 30, 20, ++contador);
        e1.getPuntoRecarga(4).reservar(LocalDate.of(2025, 11, 2), 9, 0, 40, ++contador);
        e1.getPuntoRecarga(4).reservar(LocalDate.of(2025, 11, 2), 9, 30, 20, ++contador);
        e1.getPuntoRecarga(4).reservar(LocalDate.of(2025, 11, 2), 15, 30, 40, ++contador);

        // Reservas en el punto 2 (Nivel 2)
        e1.getPuntoRecarga(2).reservar(LocalDate.of(2025, 11, 1), 13, 30, 60, ++contador);
        e1.getPuntoRecarga(2).reservar(LocalDate.of(2025, 11, 1), 20, 0, 45, ++contador);
        e1.getPuntoRecarga(2).reservar(LocalDate.of(2025, 11, 3), 10, 0, 45, ++contador);

        // Reservas en el punto 1 (Nivel 1)
        e1.getPuntoRecarga(1).reservar(LocalDate.of(2025, 11, 2), 16, 30, 90, ++contador);
        e1.getPuntoRecarga(1).reservar(LocalDate.of(2025, 11, 4), 19, 0, 90, ++contador);

        // Actualizar el contador global de reservas
        gestor.setContadorReservas(contador);

        // --- Electrolinera 3: "E.S. Rápida Sur" ---
        Electrolinera e3 = new Electrolinera(3, "E.S. Rapida Sur",
                3, 3, 4, TipoEstacion.RUTA, 40.416775, -3.703790);
        gestor.setElectrolinera(3, e3);
    }
}
