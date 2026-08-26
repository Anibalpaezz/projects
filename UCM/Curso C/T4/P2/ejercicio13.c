/* Escriba un programa en C que solicite al usuario números positivos de tres o más cifras
y  compruebe  si  son  pares.  Si  el  número  introducido  es  positivo  pero  de  una  o  dos
cifras,  se  solicitará un nuevo número. El programa finaliza cuando se introduce “0” o
un número negativo.  */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero_usuario = 1;

    while (numero_usuario > 0)
    {
        printf("Introduce un número de 3 o mas cifras positivo: ");
        scanf("%d", &numero_usuario);
        if (numero_usuario / 100 < 1 && numero_usuario > 0)
        {
            printf("Número no válido. Debe tener al menos 3 cifras.\n");
        } else if (numero_usuario % 2 == 0)
        {
            printf("Número par.\n");
        } else
        {
            printf("Número impar.\n");
        }
    }

    printf("Programa finalizado, se ha introducido un número no positivo o 0.\n");

    return 0;
}

