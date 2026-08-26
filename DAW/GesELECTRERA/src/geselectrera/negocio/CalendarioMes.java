package geselectrera.negocio;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Gestiona las reservas de un punto de recarga.
 * Verifica disponibilidad y calcula niveles de ocupación.
 */
public class CalendarioMes {

    private List<Reserva> reservas;

    public CalendarioMes() {
        this.reservas = new ArrayList<>();
    }

    public boolean estaDisponible(LocalDate fecha, int hora, int minuto, int duracion) {
        for (Reserva r : reservas) {
            if (r.seSolapa(fecha, hora, minuto, duracion)) return false;
        }
        return true;
    }

    public void agregarReserva(int puntoRecargaId, NivelCarga nivel,
                               LocalDate fecha, int hora, int minuto,
                               int duracion, int numReserva) {
        reservas.add(new Reserva(puntoRecargaId, nivel, fecha,
                hora, minuto, duracion, numReserva));
    }

    public List<Reserva> obtenerReservasDelMes(int mes, int anio) {
        List<Reserva> mensuales = new ArrayList<>();
        for (Reserva r : reservas) {
            if (r.getFecha().getMonthValue() == mes && r.getFecha().getYear() == anio) {
                mensuales.add(r);
            }
        }
        return mensuales;
    }

    public int minutosReservadosEnDia(int dia, int mes, int anio) {
        int total = 0;
        for (Reserva r : reservas) {
            total += r.minutosEnDia(dia, mes, anio);
        }
        return total;
    }

    public String calcularOcupacionDiaria(int dia, int mes, int anio) {
        int minutos = minutosReservadosEnDia(dia, mes, anio);
        if (minutos == 0) return "00";
        else if (minutos <= 360) return "Ba";
        else if (minutos <= 720) return "Me";
        else return "Al";
    }

    public int[] getDiaMaximaOcupacion(int mes, int anio) {
        int totalDias = LocalDate.of(anio, mes, 1).lengthOfMonth();
        int diaMax = 0, minutosMax = 0;
        for (int dia = 1; dia <= totalDias; dia++) {
            int minutos = minutosReservadosEnDia(dia, mes, anio);
            if (minutos > minutosMax) {
                minutosMax = minutos;
                diaMax = dia;
            }
        }
        int porcentaje = (minutosMax * 100) / 1440;
        return new int[]{diaMax, porcentaje};
    }

    public static String getNombreMes(int mes) {
        return switch (mes) {
            case 1 -> "Enero"; case 2 -> "Febrero"; case 3 -> "Marzo";
            case 4 -> "Abril"; case 5 -> "Mayo"; case 6 -> "Junio";
            case 7 -> "Julio"; case 8 -> "Agosto"; case 9 -> "Septiembre";
            case 10 -> "Octubre"; case 11 -> "Noviembre"; case 12 -> "Diciembre";
            default -> "Mes inválido";
        };
    }
}
