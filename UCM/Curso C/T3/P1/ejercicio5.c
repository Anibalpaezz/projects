/* Escriba un programa que calcule el perímetro de una circunferencia. NOTA  perimetro  =  2  *  PI  *  r).  Se  recomienda  definir  PI  como  una  constante
usando la directiva define. */

#include <stdio.h>
#define PI 3.14159

int main(int argc, char const *argv[])
{
    // Variables
    float radio, perimetro;

    // Pedir los datos
    printf("Calculadora de perímetro de una circunferencia.\n");
    printf("Introduce el radio de la circunferencia: ");
    scanf("%f", &radio);

    // Calculos
    perimetro = 2 * PI * radio;
    printf("El perímetro de la circunferencia con radio %.2f es %.2f\n", radio, perimetro);
    return 0;
}

