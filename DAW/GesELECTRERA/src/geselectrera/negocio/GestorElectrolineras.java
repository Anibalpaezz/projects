package geselectrera.negocio;

import java.time.LocalDate;
import java.util.*;

/**
 * Fachada de la capa de Negocio del sistema GesELECTRERA.
 *
 * Esta clase centraliza toda la lógica de negocio y es el único punto
 * de acceso desde las capas externas (UI, datos). No realiza ninguna
 * operación de entrada/salida (no usa Scanner ni System.out).
 *
 * Gestiona hasta 10 electrolineras y coordina todas las operaciones:
 * edición de electrolineras y puntos de recarga, reservas, listados
 * y calendarios de ocupación.
 */
public class GestorElectrolineras {

    private Electrolinera[] electrolineras;
    private int contadorReservas;

    public GestorElectrolineras() {
        this.electrolineras = new Electrolinera[10];
        this.contadorReservas = 0;
    }

    // ================================================================
    // EDITAR ELECTROLINERA
    // ================================================================

    /**
     * Crea o reemplaza una electrolinera. Si el total de puntos es 0,
     * da de baja la electrolinera existente.
     *
     * @return Mensaje de resultado (éxito o error)
     */
    public String editarElectrolinera(int id, String nombre, int nivel1, int nivel2,
                                       int nivel3, TipoEstacion tipo,
                                       double latitud, double longitud) {
        if (id < 1 || id > 10) return "Identificador inválido.";
        if (nombre == null || nombre.trim().isEmpty() || nombre.length() > 20)
            return "Nombre inválido.";

        int total = nivel1 + nivel2 + nivel3;
        if (total > 20) return "Error: El número total de puntos no puede superar 20.";

        if (total == 0) {
            electrolineras[id - 1] = null;
            return "Electrolinera dada de baja.";
        }

        electrolineras[id - 1] = new Electrolinera(id, nombre, nivel1, nivel2,
                nivel3, tipo, latitud, longitud);
        return "Electrolinera actualizada correctamente.";
    }

    // ================================================================
    // EDITAR PUNTO DE RECARGA
    // ================================================================

    /**
     * Configura un punto de recarga validando compatibilidad.
     *
     * @return Mensaje de resultado (éxito o error)
     */
    public String editarPuntoRecarga(int idElectro, int idPunto,
                                      String tipoCorriente, int potencia, int rodaja) {
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return "Electrolinera no encontrada.";

        PuntoRecarga punto = electro.getPuntoRecarga(idPunto);
        if (punto == null) return "Punto de recarga no encontrado.";

        if (rodaja <= 0) return "La rodaja debe ser mayor que 0.";

        NivelCarga nivel = NivelCarga.determinarNivel(tipoCorriente, potencia);
        if (nivel == null) return "Combinación de corriente y potencia no válida.";

        // Validar compatibilidad con los límites de la electrolinera
        int configurados = electro.contarPuntosConfigurados(nivel);
        int max = electro.getMaxPuntosPorNivel(nivel);
        boolean yaEraEseNivel = punto.isConfigurado() && punto.getNivel() == nivel;

        if (!yaEraEseNivel && configurados >= max) {
            return "Máximo de puntos de " + nivel + " alcanzado para esta electrolinera.";
        }

        if (!punto.configurar(tipoCorriente, potencia, rodaja)) {
            return "Error al configurar el punto.";
        }

        return String.format("Configuración correcta: Electrolinera: %d. Punto de carga: %d. %s",
                idElectro, idPunto, nivel);
    }

    // ================================================================
    // RESERVAR PUNTO DE RECARGA
    // ================================================================

    /**
     * Busca un punto disponible del nivel indicado y realiza la reserva.
     *
     * @return La Reserva creada, o null si no hay disponibilidad
     */
    public Reserva reservarPuntoRecarga(int idElectro, NivelCarga nivel,
                                        LocalDate fecha, int hora, int minuto,
                                        int duracionSolicitada) {
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return null;

        List<PuntoRecarga> puntosNivel = electro.getPuntosPorNivel(nivel);
        if (puntosNivel.isEmpty()) return null;

        // Ajustar duración a la rodaja
        int duracionAjustada = puntosNivel.get(0).ajustarDuracion(duracionSolicitada);

        // Buscar punto disponible
        PuntoRecarga disponible = electro.buscarPuntoDisponible(nivel, fecha,
                hora, minuto, duracionAjustada);
        if (disponible == null) return null;

        // Reajustar con la rodaja del punto concreto encontrado
        duracionAjustada = disponible.ajustarDuracion(duracionSolicitada);

        // Realizar la reserva
        contadorReservas++;
        disponible.reservar(fecha, hora, minuto, duracionAjustada, contadorReservas);

        // Devolver la reserva creada (la última añadida al calendario)
        List<Reserva> reservas = disponible.obtenerReservasDelMes(
                fecha.getMonthValue(), fecha.getYear());
        return reservas.get(reservas.size() - 1);
    }

    /**
     * Obtiene la duración ajustada a la rodaja sin realizar la reserva.
     * Útil para que la UI muestre los datos antes de confirmar.
     */
    public int getDuracionAjustada(int idElectro, NivelCarga nivel, int duracionSolicitada) {
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return duracionSolicitada;
        List<PuntoRecarga> puntosNivel = electro.getPuntosPorNivel(nivel);
        if (puntosNivel.isEmpty()) return duracionSolicitada;
        return puntosNivel.get(0).ajustarDuracion(duracionSolicitada);
    }

    /**
     * Comprueba si hay puntos disponibles sin reservar.
     */
    public boolean hayDisponibilidad(int idElectro, NivelCarga nivel,
                                     LocalDate fecha, int hora, int minuto, int duracion) {
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return false;
        int durAjustada = getDuracionAjustada(idElectro, nivel, duracion);
        return electro.buscarPuntoDisponible(nivel, fecha, hora, minuto, durAjustada) != null;
    }

    // ================================================================
    // LISTAR RESERVAS DE ELECTROLINERA
    // ================================================================

    /**
     * Obtiene las reservas de una electrolinera agrupadas por nivel.
     *
     * @return Mapa ordenado NivelCarga -> Lista de Reservas
     */
    public Map<NivelCarga, List<Reserva>> getReservasElectrolinera(int idElectro,
                                                                     int mes, int anio) {
        Map<NivelCarga, List<Reserva>> resultado = new LinkedHashMap<>();
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return resultado;

        for (NivelCarga nivel : NivelCarga.values()) {
            List<Reserva> reservasNivel = new ArrayList<>();
            for (PuntoRecarga p : electro.getPuntosPorNivel(nivel)) {
                reservasNivel.addAll(p.obtenerReservasDelMes(mes, anio));
            }
            if (!reservasNivel.isEmpty()) {
                resultado.put(nivel, reservasNivel);
            }
        }
        return resultado;
    }

    // ================================================================
    // CALENDARIO MENSUAL DE PUNTO DE RECARGA
    // ================================================================

    /**
     * Obtiene el calendario de ocupación de un punto para un mes.
     * Devuelve un array de Strings con la ocupación de cada día (00/Ba/Me/Al).
     */
    public String[] getCalendarioMensual(int idElectro, int idPunto, int mes, int anio) {
        PuntoRecarga punto = getPuntoRecarga(idElectro, idPunto);
        if (punto == null || !punto.isConfigurado()) return null;

        int totalDias = LocalDate.of(anio, mes, 1).lengthOfMonth();
        String[] ocupacion = new String[totalDias];
        CalendarioMes cal = punto.getCalendario();
        for (int dia = 1; dia <= totalDias; dia++) {
            ocupacion[dia - 1] = cal.calcularOcupacionDiaria(dia, mes, anio);
        }
        return ocupacion;
    }

    /**
     * Obtiene el día de máxima ocupación y su porcentaje.
     *
     * @return Array [día, porcentaje], o [0, 0] si no hay reservas
     */
    public int[] getMaximaOcupacion(int idElectro, int idPunto, int mes, int anio) {
        PuntoRecarga punto = getPuntoRecarga(idElectro, idPunto);
        if (punto == null || !punto.isConfigurado()) return new int[]{0, 0};
        return punto.getCalendario().getDiaMaximaOcupacion(mes, anio);
    }

    // ================================================================
    // ACCESO A DATOS
    // ================================================================

    public Electrolinera getElectrolinera(int id) {
        if (id < 1 || id > 10) return null;
        return electrolineras[id - 1];
    }

    public PuntoRecarga getPuntoRecarga(int idElectro, int idPunto) {
        Electrolinera electro = getElectrolinera(idElectro);
        if (electro == null) return null;
        return electro.getPuntoRecarga(idPunto);
    }

    public Electrolinera[] getElectrolineras() {
        return electrolineras;
    }

    /**
     * Permite cargar datos externos (desde la capa de datos/stubs).
     */
    public void setElectrolinera(int id, Electrolinera electrolinera) {
        if (id >= 1 && id <= 10) {
            electrolineras[id - 1] = electrolinera;
        }
    }

    public int getContadorReservas() {
        return contadorReservas;
    }

    public void setContadorReservas(int contador) {
        this.contadorReservas = contador;
    }
}
