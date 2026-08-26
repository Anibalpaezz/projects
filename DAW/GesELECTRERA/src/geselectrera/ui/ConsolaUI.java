package geselectrera.ui;

import geselectrera.negocio.*;
import java.time.LocalDate;
import java.util.*;

/**
 * Stub de la capa de Interfaz de Usuario (IU).
 *
 * Esta clase se encarga exclusivamente de la interacción con el usuario
 * a través de la consola: leer datos de entrada y mostrar resultados.
 * Toda la lógica de negocio se delega al GestorElectrolineras.
 *
 * En un sistema real, esta capa podría sustituirse por una interfaz
 * gráfica (GUI) o una interfaz web sin modificar la capa de negocio.
 */
public class ConsolaUI {

    private GestorElectrolineras gestor;
    private Scanner sc;

    public ConsolaUI(GestorElectrolineras gestor) {
        this.gestor = gestor;
        this.sc = new Scanner(System.in);
    }

    /**
     * Ejecuta el bucle principal del menú.
     */
    public void ejecutar() {
        boolean salir = false;

        while (!salir) {
            mostrarMenu();
            String opcion = sc.nextLine().trim().toUpperCase();

            switch (opcion) {
                case "E" -> editarElectrolinera();
                case "P" -> editarPuntoRecarga();
                case "R" -> reservarPuntoRecarga();
                case "L" -> listarReservasElectrolinera();
                case "M" -> listarCalendarioMensual();
                case "S" -> salir = true;
                default -> System.out.println("Opción inválida.");
            }
        }
        System.out.println("Gracias por utilizar GesELECTRERA.");
    }

    private void mostrarMenu() {
        System.out.println("\nGesELECTRERA: Gestión de electrolineras");
        System.out.println();
        System.out.println("    Editar electrolinera          (Pulsar E)");
        System.out.println("    Editar punto de recarga       (Pulsar P)");
        System.out.println("    Reservar punto de recarga     (Pulsar R)");
        System.out.println("    Listar reservas electrolinera (Pulsar L)");
        System.out.println("    Listar servicio mensual punto (Pulsar M)");
        System.out.println("    Salir                         (Pulsar S)");
        System.out.println();
        System.out.print("Teclear una opción válida (E|P|R|L|M|S)? ");
    }

    // ================================================================
    // EDITAR ELECTROLINERA
    // ================================================================

    private void editarElectrolinera() {
        System.out.println("\nEditar electrolinera:");

        System.out.print("Identificador (número entre 1 y 10)? ");
        int id = leerEntero();

        System.out.print("Nombre (entre 1 y 20 caracteres)? ");
        String nombre = sc.nextLine().trim();

        System.out.print("Núm. de puntos de carga RÁPIDOS-Nivel 3? ");
        int nivel3 = leerEntero();
        System.out.print("Núm. de puntos de carga SEMI-RÁPIDOS-Nivel 2? ");
        int nivel2 = leerEntero();
        System.out.print("Núm. de puntos de carga LENTOS-Nivel 1? ");
        int nivel1 = leerEntero();

        System.out.print("Tipo Estación (Urbana, Ruta, Mixta)? ");
        String tipoTexto = sc.nextLine().trim();
        TipoEstacion tipo = TipoEstacion.fromTexto(tipoTexto);
        if (tipo == null) {
            System.out.println("Tipo de estación inválido.");
            return;
        }

        System.out.print("Latitud (WGS84)? ");
        double latitud = leerDecimal();
        System.out.print("Longitud (WGS84)? ");
        double longitud = leerDecimal();

        System.out.println("\nIMPORTANTE: Esta opción borra los datos anteriores.");
        System.out.print("Son correctos los nuevos datos (S/N)? ");
        if (!sc.nextLine().trim().equalsIgnoreCase("S")) {
            System.out.println("Edición cancelada.");
            return;
        }

        // Delegar al gestor
        String resultado = gestor.editarElectrolinera(id, nombre, nivel1, nivel2,
                nivel3, tipo, latitud, longitud);
        System.out.println(resultado);
    }

    // ================================================================
    // EDITAR PUNTO DE RECARGA
    // ================================================================

    private void editarPuntoRecarga() {
        System.out.println("\nEditar punto de carga:");

        System.out.print("Identificador electrolinera (número entre 1 y 10)? ");
        int idElectro = leerEntero();

        System.out.print("Identificador punto de carga (número entre 1 y 20)? ");
        int idPunto = leerEntero();

        System.out.print("Tipo de corriente (DC/AC)? ");
        String corriente = sc.nextLine().trim().toUpperCase();

        System.out.print("Potencia (kW)? ");
        int potencia = leerEntero();

        System.out.print("Rodaja mínima de recarga (minutos)? ");
        int rodaja = leerEntero();

        System.out.print("Son correctos los nuevos datos (S/N)? ");
        if (!sc.nextLine().trim().equalsIgnoreCase("S")) {
            System.out.println("Edición cancelada.");
            return;
        }

        // Delegar al gestor
        String resultado = gestor.editarPuntoRecarga(idElectro, idPunto,
                corriente, potencia, rodaja);
        System.out.println(resultado);
    }

    // ================================================================
    // RESERVAR PUNTO DE RECARGA
    // ================================================================

    private void reservarPuntoRecarga() {
        System.out.println("\nReservar punto de recarga:");

        System.out.print("Identificador de electrolinera? ");
        int idElectro = leerEntero();
        Electrolinera electro = gestor.getElectrolinera(idElectro);
        if (electro == null) {
            System.out.println("Electrolinera no encontrada.");
            return;
        }

        System.out.print("Tipo de punto de recarga (Nivel 1/Nivel 2/Nivel 3)? ");
        String nivelTexto = sc.nextLine().trim().toUpperCase();
        NivelCarga nivel = parseNivel(nivelTexto);
        if (nivel == null) {
            System.out.println("Nivel inválido.");
            return;
        }

        System.out.print("Datos reserva: Día? ");
        int dia = leerEntero();
        System.out.print("Datos reserva: Mes? ");
        int mes = leerEntero();
        System.out.print("Datos reserva: Año? ");
        int anio = leerEntero();

        LocalDate fecha;
        try {
            fecha = LocalDate.of(anio, mes, dia);
        } catch (Exception e) {
            System.out.println("Fecha inválida.");
            return;
        }

        System.out.print("Datos reserva: Hora? ");
        int hora = leerEntero();
        System.out.print("Datos reserva: Minuto? ");
        int minuto = leerEntero();

        if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
            System.out.println("Hora o minuto inválido.");
            return;
        }

        System.out.print("Datos reserva: Duración? ");
        int duracion = leerEntero();

        // Obtener duración ajustada del gestor
        int duracionAjustada = gestor.getDuracionAjustada(idElectro, nivel, duracion);

        // Comprobar disponibilidad antes de mostrar datos
        if (!gestor.hayDisponibilidad(idElectro, nivel, fecha, hora, minuto, duracion)) {
            System.out.println("Fecha/hora elegida completa – La reserva no se puede realizar");
            return;
        }

        // Mostrar datos de la reserva
        System.out.println("\nDatos de la Reserva:");
        System.out.printf("E/S: %s (Id = %d)%n", electro.getNombre(), idElectro);
        System.out.printf("Fecha reserva: %d-%d-%d%n", dia, mes, anio);
        System.out.printf("Hora reserva: %d:%02d%n", hora, minuto);
        System.out.printf("Duración: %d minutos%n", duracionAjustada);

        System.out.print("Son correctos los datos de la reserva (S/N)? ");
        if (!sc.nextLine().trim().equalsIgnoreCase("S")) {
            System.out.println("Reserva cancelada.");
            return;
        }

        // Delegar la reserva al gestor
        Reserva reserva = gestor.reservarPuntoRecarga(idElectro, nivel, fecha,
                hora, minuto, duracion);

        if (reserva != null) {
            PuntoRecarga punto = gestor.getPuntoRecarga(idElectro, reserva.getPuntoRecargaId());
            int numRodajas = reserva.getDuracion() / punto.getRodajaMinima();

            System.out.println("\nReserva correcta.");
            System.out.printf("    Identificador: Punto de carga %s%n", reserva.getIdentificador());
            System.out.printf("    Fecha y hora: %d-%d-%d %d:%02d%n",
                    dia, mes, anio, hora, minuto);
            System.out.printf("    Tiempo %d minutos (%dx%d)%n",
                    reserva.getDuracion(), numRodajas, punto.getRodajaMinima());
        } else {
            System.out.println("Error al realizar la reserva.");
        }
    }

    // ================================================================
    // LISTAR RESERVAS DE ELECTROLINERA
    // ================================================================

    private void listarReservasElectrolinera() {
        System.out.println("\nListar reservas de electrolinera:");

        System.out.print("Identificador de la electrolinera? ");
        int idElectro = leerEntero();
        Electrolinera electro = gestor.getElectrolinera(idElectro);
        if (electro == null) {
            System.out.println("Electrolinera no encontrada.");
            return;
        }

        System.out.print("Mes Reservas? ");
        int mes = leerEntero();
        System.out.print("Año Reservas? ");
        int anio = leerEntero();

        // Obtener datos del gestor
        Map<NivelCarga, List<Reserva>> reservas = gestor.getReservasElectrolinera(
                idElectro, mes, anio);

        if (reservas.isEmpty()) {
            System.out.printf("%nLa electrolinera \"%s\" no tiene reservas para el mes %d del año %d.%n",
                    electro.getNombre(), mes, anio);
            return;
        }

        System.out.printf("%nLa electrolinera \"%s\" tiene las siguientes reservas para el mes %d del año %d:%n",
                electro.getNombre(), mes, anio);

        for (Map.Entry<NivelCarga, List<Reserva>> entry : reservas.entrySet()) {
            System.out.println("\n" + entry.getKey() + ".");
            for (Reserva r : entry.getValue()) {
                System.out.printf("    Punto de recarga %s Fecha: %d/%d/%d Hora: %d:%02d Duración: %d min.%n",
                        r.getIdentificador(),
                        r.getFecha().getDayOfMonth(), r.getFecha().getMonthValue(),
                        r.getFecha().getYear(), r.getHora(), r.getMinuto(), r.getDuracion());
            }
        }
    }

    // ================================================================
    // LISTAR CALENDARIO MENSUAL
    // ================================================================

    private void listarCalendarioMensual() {
        System.out.println("\nReservas Mensuales Punto de Recarga:");

        System.out.print("Identificador de la electrolinera? ");
        int idElectro = leerEntero();
        Electrolinera electro = gestor.getElectrolinera(idElectro);
        if (electro == null) {
            System.out.println("Electrolinera no encontrada.");
            return;
        }

        System.out.print("Numero de punto de recarga? ");
        int idPunto = leerEntero();
        PuntoRecarga punto = gestor.getPuntoRecarga(idElectro, idPunto);
        if (punto == null || !punto.isConfigurado()) {
            System.out.println("Punto de recarga no encontrado o no configurado.");
            return;
        }

        while (true) {
            System.out.print("Selección Mes? ");
            int mes = leerEntero();
            System.out.print("Selección Año? ");
            int anio = leerEntero();

            if (mes < 1 || mes > 12) {
                System.out.println("Mes inválido.");
                return;
            }

            // Obtener datos del gestor
            String[] ocupacion = gestor.getCalendarioMensual(idElectro, idPunto, mes, anio);
            int[] maxOcup = gestor.getMaximaOcupacion(idElectro, idPunto, mes, anio);

            // Mostrar encabezado
            System.out.printf("%n        Ocupación Punto de Recarga: %d%n", idPunto);
            System.out.printf("        Electrolinera: %s%n%n", electro.getNombre());
            System.out.printf("        %s                %d%n%n",
                    CalendarioMes.getNombreMes(mes), anio);
            System.out.println("    L   M   X   J   V   S   D");

            // Dibujar calendario
            LocalDate primeroMes = LocalDate.of(anio, mes, 1);
            int inicioSemana = primeroMes.getDayOfWeek().getValue();

            for (int i = 1; i < inicioSemana; i++) {
                System.out.print("    ");
            }

            for (int dia = 0; dia < ocupacion.length; dia++) {
                System.out.printf("%-4s", ocupacion[dia]);
                if ((dia + inicioSemana) % 7 == 0) {
                    System.out.println();
                }
            }
            System.out.println();

            // Mostrar nivel y máxima ocupación
            System.out.printf("%nPunto de Carga %d – %s%n", idPunto, punto.getNivel().getCodigo());

            if (maxOcup[0] > 0) {
                System.out.printf("Dia de máxima ocupación – %d/%d/%d (%d%%)%n",
                        maxOcup[0], mes, anio, maxOcup[1]);
            } else {
                System.out.println("No hay reservas en este mes.");
            }

            System.out.print("\nMostrar otro mes (S/N)? ");
            if (!sc.nextLine().trim().equalsIgnoreCase("S")) break;
        }
    }

    // ================================================================
    // MÉTODOS AUXILIARES
    // ================================================================

    private NivelCarga parseNivel(String texto) {
        return switch (texto) {
            case "N1", "NIVEL 1", "NIVEL1" -> NivelCarga.NIVEL1;
            case "N2", "NIVEL 2", "NIVEL2" -> NivelCarga.NIVEL2;
            case "N3", "NIVEL 3", "NIVEL3" -> NivelCarga.NIVEL3;
            default -> null;
        };
    }

    private int leerEntero() {
        try {
            return Integer.parseInt(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private double leerDecimal() {
        try {
            return Double.parseDouble(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
