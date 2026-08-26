package geselectrera.negocio;

/**
 * Enumeración que define los tres niveles de carga disponibles.
 * Cada nivel tiene asociado un tipo de corriente y rango de potencia.
 */
public enum NivelCarga {

    NIVEL1("AC", 2, 4),
    NIVEL2("AC", 11, 22),
    NIVEL3("DC", 50, 300);

    private final String tipoCorriente;
    private final int potenciaMin;
    private final int potenciaMax;

    NivelCarga(String tipoCorriente, int potenciaMin, int potenciaMax) {
        this.tipoCorriente = tipoCorriente;
        this.potenciaMin = potenciaMin;
        this.potenciaMax = potenciaMax;
    }

    public String getTipoCorriente() { return tipoCorriente; }
    public int getPotenciaMin() { return potenciaMin; }
    public int getPotenciaMax() { return potenciaMax; }

    public static NivelCarga determinarNivel(String tipoCorriente, int potencia) {
        for (NivelCarga nivel : values()) {
            if (nivel.tipoCorriente.equalsIgnoreCase(tipoCorriente)
                    && potencia >= nivel.potenciaMin
                    && potencia <= nivel.potenciaMax) {
                return nivel;
            }
        }
        return null;
    }

    public String getCodigo() {
        return switch (this) {
            case NIVEL1 -> "N1";
            case NIVEL2 -> "N2";
            case NIVEL3 -> "N3";
        };
    }

    @Override
    public String toString() {
        return switch (this) {
            case NIVEL1 -> "Nivel 1 (Lento)";
            case NIVEL2 -> "Nivel 2 (Semi-Rápido)";
            case NIVEL3 -> "Nivel 3 (Rápido)";
        };
    }
}
