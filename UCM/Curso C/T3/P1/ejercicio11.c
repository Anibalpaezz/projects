/* Escriba un programa en  C que convierta  euros a  dolares (1  euro  = 1.286  dolares)  y  a
libras esterlinas (1 euro = 0,865 libras). Imprima los resultados por pantalla. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float euros;
    float cambio_dolar = 1.286;
    float cambio_libra = 0.865;

    // Pedir los datos
    printf("Calculadora de conversión de euros a dólares y libras.\n");
    printf("Introduce la cantidad en euros: ");
    scanf("%f", &euros);

    // Calculos
    float dolares = euros * cambio_dolar;
    float libras = euros * cambio_libra;

    // Mostrar resultados
    printf("%.2f euros son %.2f dólares.\n", euros, dolares);
    printf("%.2f euros son %.2f libras.\n", euros, libras);

    return 0;
}
