/* Escriba  un  programa  que  muestre  en  pantalla  todos  los  múltiplos  de  3  entre  los
números 1 y 100.  */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero = 1;

    // Bucle
    for (size_t i = 0; i < 100; i++)
    {
        if (numero % 3 == 0)
        {
            printf("%d ", numero);
        }
        numero++;
    }

    return 0;
}

