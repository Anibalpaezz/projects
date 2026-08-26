/* Escriba un programa en C que muestre en pantalla los números enteros del 1 al 100. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero = 1;

    // Mostrar resultados
    for (size_t i = 0; i < 100; i++)
    {
        if (numero % 10 == 0)
        {
            printf("%d\n", numero);
            numero++;
        } else {
            printf("%d ", numero);
            numero++;
        }
    }

    return 0;
}

