package geselectrera.negocio;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Electrolinera con hasta 20 puntos de recarga de distintos niveles.
 */
public class Electrolinera {

    private int id;
    private String nombre;
    private int numPuntosNivel1;
    private int numPuntosNivel2;
    private int numPuntosNivel3;
    private TipoEstacion tipoEstacion;
    private double latitud;
    private double longitud;
    private PuntoRecarga[] puntosRecarga;
    private int totalPuntos;

    public Electrolinera(int id, String nombre, int numPuntosNivel1,
                         int numPuntosNivel2, int numPuntosNivel3,
                         TipoEstacion tipoEstacion, double latitud, double longitud) {
        this.id = id;
        this.nombre = nombre;
        this.numPuntosNivel1 = numPuntosNivel1;
        this.numPuntosNivel2 = numPuntosNivel2;
        this.numPuntosNivel3 = numPuntosNivel3;
        this.tipoEstacion = tipoEstacion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.totalPuntos = numPuntosNivel1 + numPuntosNivel2 + numPuntosNivel3;
        this.puntosRecarga = new PuntoRecarga[20];
        for (int i = 0; i < totalPuntos; i++) {
            puntosRecarga[i] = new PuntoRecarga(i + 1);
        }
    }

    public PuntoRecarga getPuntoRecarga(int idPunto) {
        if (idPunto < 1 || idPunto > 20) return null;
        return puntosRecarga[idPunto - 1];
    }

    public int contarPuntosConfigurados(NivelCarga nivel) {
        int contador = 0;
        for (PuntoRecarga p : puntosRecarga) {
            if (p != null && p.isConfigurado() && p.getNivel() == nivel) contador++;
        }
        return contador;
    }

    public int getMaxPuntosPorNivel(NivelCarga nivel) {
        return switch (nivel) {
            case NIVEL1 -> numPuntosNivel1;
            case NIVEL2 -> numPuntosNivel2;
            case NIVEL3 -> numPuntosNivel3;
        };
    }

    public PuntoRecarga buscarPuntoDisponible(NivelCarga nivel, LocalDate fecha,
                                              int hora, int minuto, int duracion) {
        for (PuntoRecarga p : puntosRecarga) {
            if (p != null && p.isConfigurado() && p.getNivel() == nivel
                    && p.estaDisponible(fecha, hora, minuto, duracion)) {
                return p;
            }
        }
        return null;
    }

    public List<PuntoRecarga> getPuntosPorNivel(NivelCarga nivel) {
        List<PuntoRecarga> puntos = new ArrayList<>();
        for (PuntoRecarga p : puntosRecarga) {
            if (p != null && p.isConfigurado() && p.getNivel() == nivel) puntos.add(p);
        }
        return puntos;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public int getNumPuntosNivel1() { return numPuntosNivel1; }
    public int getNumPuntosNivel2() { return numPuntosNivel2; }
    public int getNumPuntosNivel3() { return numPuntosNivel3; }
    public TipoEstacion getTipoEstacion() { return tipoEstacion; }
    public double getLatitud() { return latitud; }
    public double getLongitud() { return longitud; }
    public int getTotalPuntos() { return totalPuntos; }
    public PuntoRecarga[] getPuntosRecarga() { return puntosRecarga; }
}
