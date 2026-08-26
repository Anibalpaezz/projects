/* Escriba  un  programa  que  pida  un  tiempo  en  segundos  y  lo  muestre  convertido  a
minutos y segundos. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int segundos, minutos;

    // Pedir los datos
    printf("Calculadora de conversión de segundos a minutos y segundos.\n");
    printf("Introduce el número de segundos: ");
    scanf("%d", &segundos);

    // Calculos
    minutos = segundos / 60;
    segundos = segundos % 60;

    // Mostrar resultados
    printf("El tiempo es %d minutos y %d segundos.\n", minutos, segundos);
    return 0;
}

