/* Escriba un programa que pida una temperatura en grados Farenheit y la pase a Celsius.  NOTA: celsius = (farenheit -32)*5/9 */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float gradosFarenheit, gradosCelsius;

    // Pedir datos
    printf("Conversor de grados Farenheit a Celsius\n");
    printf("Ingrese la cantidad de grados Farenheit: ");
    scanf("%f", &gradosFarenheit);

    // Proceso
    gradosCelsius = (gradosFarenheit - 32) * 5 / 9;

    // Mostrar resultado
    printf("%.2f grados Farenheit son %.2f grados Celsius\n", gradosFarenheit, gradosCelsius);

    return 0;
}

