package geselectrera.negocio;

import java.time.LocalDate;

/**
 * Representa una reserva de un punto de recarga.
 * Las reservas son por franjas horarias en minutos.
 */
public class Reserva {

    private String identificador;
    private int puntoRecargaId;
    private LocalDate fecha;
    private int hora;
    private int minuto;
    private int duracion;
    private int numReserva;

    public Reserva(int puntoRecargaId, NivelCarga nivel, LocalDate fecha,
                   int hora, int minuto, int duracion, int numReserva) {
        this.puntoRecargaId = puntoRecargaId;
        this.fecha = fecha;
        this.hora = hora;
        this.minuto = minuto;
        this.duracion = duracion;
        this.numReserva = numReserva;
        this.identificador = String.format("%s-%d-%04d-%02d-%d",
                nivel.getCodigo(), puntoRecargaId, numReserva,
                fecha.getMonthValue(), fecha.getYear());
    }

    public boolean seSolapa(LocalDate otraFecha, int otraHora,
                            int otroMinuto, int otraDuracion) {
        if (!this.fecha.equals(otraFecha)) return false;
        int inicioExistente = this.hora * 60 + this.minuto;
        int finExistente = inicioExistente + this.duracion;
        int inicioNueva = otraHora * 60 + otroMinuto;
        int finNueva = inicioNueva + otraDuracion;
        return !(finNueva <= inicioExistente || inicioNueva >= finExistente);
    }

    public int minutosEnDia(int dia, int mes, int anio) {
        if (fecha.getDayOfMonth() == dia
                && fecha.getMonthValue() == mes
                && fecha.getYear() == anio) {
            return duracion;
        }
        return 0;
    }

    public String getIdentificador() { return identificador; }
    public int getPuntoRecargaId() { return puntoRecargaId; }
    public LocalDate getFecha() { return fecha; }
    public int getHora() { return hora; }
    public int getMinuto() { return minuto; }
    public int getDuracion() { return duracion; }
    public int getNumReserva() { return numReserva; }
}
