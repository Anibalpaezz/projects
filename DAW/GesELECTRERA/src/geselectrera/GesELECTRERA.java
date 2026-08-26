package geselectrera;

import geselectrera.negocio.GestorElectrolineras;
import geselectrera.datos.DatosStub;
import geselectrera.ui.ConsolaUI;

/**
 * Punto de entrada del sistema GesELECTRERA.
 *
 * Conecta las tres capas del sistema:
 * 1. Capa de Negocio (GestorElectrolineras)
 * 2. Capa de Datos (DatosStub)
 * 3. Capa de IU (ConsolaUI)
 */
public class GesELECTRERA {

    public static void main(String[] args) {
        // Inicialización del gestor de electrolineras
        GestorElectrolineras gestor = new GestorElectrolineras();

        // Datos ya definidos
        DatosStub.cargarDatosPrueba(gestor);

        // Llamada a la interfaz de usuario
        ConsolaUI ui = new ConsolaUI(gestor);
        ui.ejecutar();
    }
}
