#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero1, numero2, numero3;

    // Pedir datos
    printf("Introduce tres numeros enteros separados por espacios: ");
    scanf("%d %d %d", &numero1, &numero2, &numero3);

    // Comprobaciones
    if (numero1 >= numero2 && numero1 >= numero3)
    {
        if (numero2 >= numero3)
        {
            printf("Orden descendente: %d, %d, %d\n", numero1, numero2, numero3);
        }
        else
        {
            printf("Orden descendente: %d, %d, %d\n", numero1, numero3, numero2);
        }
    }
    else if (numero2 >= numero1 && numero2 >= numero3)
    {
        if (numero1 >= numero3)
        {
            printf("Orden descendente: %d, %d, %d\n", numero2, numero1, numero3);
        }
        else
        {
            printf("Orden descendente: %d, %d, %d\n", numero2, numero3, numero1);
        }
    }
    else // numero3 es el mayor
    {
        if (numero1 >= numero2)
        {
            printf("Orden descendente: %d, %d, %d\n", numero3, numero1, numero2);
        }
        else
        {
            printf("Orden descendente: %d, %d, %d\n", numero3, numero2, numero1);
        }
    }

    return 0;
}
