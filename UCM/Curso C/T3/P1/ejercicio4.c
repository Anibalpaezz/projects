/* Escriba  un  programa  que  calcule  el  área  de  un  triángulo  rectángulo,  pidiendo  al
usuario la altura y la base. La salida por pantalla debe ser "Un triangulo rectángulo de
altura ____  y  base ____, tiene un  área de ____" (sustituyendo los espacios en blanco
por los valores)  NOTA  area = (base * altura)/2 */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float base, altura;
    float area;

    // Pedir los datos
    printf("Calculadora de área de un triángulo.\n");
    printf("Introduce la base del triángulo: ");
    scanf("%f", &base);
    printf("Introduce la altura del triángulo: ");
    scanf("%f", &altura);

    // Calculos
    area = (base * altura) / 2;
    printf("Un triangulo rectangulo de altura %.2f y base %.2f, tiene un area de %.2f", altura, base, area);
    return 0;
}

