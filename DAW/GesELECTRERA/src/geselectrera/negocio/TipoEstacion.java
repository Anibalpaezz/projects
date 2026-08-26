package geselectrera.negocio;

/**
 * Enumeración que define los tipos de estación de una electrolinera.
 */
public enum TipoEstacion {

    URBANA, RUTA, MIXTA;

    public static TipoEstacion fromTexto(String texto) {
        if (texto == null) return null;
        return switch (texto.trim().toUpperCase()) {
            case "URBANA", "U" -> URBANA;
            case "RUTA", "R" -> RUTA;
            case "MIXTA", "M" -> MIXTA;
            default -> null;
        };
    }

    @Override
    public String toString() {
        return switch (this) {
            case URBANA -> "Urbana";
            case RUTA -> "Ruta";
            case MIXTA -> "Mixta";
        };
    }
}
