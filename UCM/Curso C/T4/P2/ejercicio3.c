/* Escriba un programa en C que muestre en pantalla los números enteros del 100 al 1. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    //Variables
    int numero = 100;

    // Bucle
    for (size_t i = 0; i < 100; i++)
    {
        if (numero % 10 == 0 && numero != 100)
        {
            printf("%d\n", numero);
            numero--;
        } else
        {
            printf("%d ", numero);
            numero--;
        }


    }


    return 0;
}

