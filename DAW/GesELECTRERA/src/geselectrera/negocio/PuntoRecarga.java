package geselectrera.negocio;

import java.time.LocalDate;
import java.util.List;

/**
 * Punto de recarga individual dentro de una electrolinera.
 * Delega gestión de reservas a su CalendarioMes.
 */
public class PuntoRecarga {

    private int id;
    private String tipoCorriente;
    private int potencia;
    private NivelCarga nivel;
    private int rodajaMinima;
    private CalendarioMes calendario;
    private boolean configurado;

    public PuntoRecarga(int id) {
        this.id = id;
        this.configurado = false;
        this.calendario = new CalendarioMes();
    }

    public boolean configurar(String tipoCorriente, int potencia, int rodajaMinima) {
        NivelCarga nivelDeterminado = NivelCarga.determinarNivel(tipoCorriente, potencia);
        if (nivelDeterminado == null) return false;
        this.tipoCorriente = tipoCorriente.toUpperCase();
        this.potencia = potencia;
        this.nivel = nivelDeterminado;
        this.rodajaMinima = rodajaMinima;
        this.configurado = true;
        this.calendario = new CalendarioMes();
        return true;
    }

    public boolean estaDisponible(LocalDate fecha, int hora, int minuto, int duracion) {
        if (!configurado) return false;
        return calendario.estaDisponible(fecha, hora, minuto, duracion);
    }

    public void reservar(LocalDate fecha, int hora, int minuto, int duracion, int numReserva) {
        calendario.agregarReserva(id, nivel, fecha, hora, minuto, duracion, numReserva);
    }

    public int ajustarDuracion(int duracionSolicitada) {
        if (duracionSolicitada <= rodajaMinima) return rodajaMinima;
        int resto = duracionSolicitada % rodajaMinima;
        if (resto == 0) return duracionSolicitada;
        return duracionSolicitada + (rodajaMinima - resto);
    }

    public List<Reserva> obtenerReservasDelMes(int mes, int anio) {
        return calendario.obtenerReservasDelMes(mes, anio);
    }

    public int getId() { return id; }
    public String getTipoCorriente() { return tipoCorriente; }
    public int getPotencia() { return potencia; }
    public NivelCarga getNivel() { return nivel; }
    public int getRodajaMinima() { return rodajaMinima; }
    public CalendarioMes getCalendario() { return calendario; }
    public boolean isConfigurado() { return configurado; }
}
