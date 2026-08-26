#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero1, numero2, numero3, numero4, numero5;

    // Pedir datos
    printf("Introduce cinco numeros enteros separados por espacios: ");
    scanf("%d %d %d %d %d", &numero1, &numero2, &numero3, &numero4, &numero5);

    // Comprobaciones
    if (numero1 < numero2 && numero1 < numero3 && numero1 < numero4 && numero1 < numero5)
    {
        printf("El numero1 (%d) es el menor.\n", numero1);
    }
    else if (numero2 < numero1 && numero2 < numero3 && numero2 < numero4 && numero2 < numero5)
    {
        printf("El numero2 (%d) es el menor.\n", numero2);
    }
    else if (numero3 < numero1 && numero3 < numero2 && numero3 < numero4 && numero3 < numero5)
    {
        printf("El numero3 (%d) es el menor.\n", numero3);
    }
    else if (numero4 < numero1 && numero4 < numero2 && numero4 < numero3 && numero4 < numero5)
    {
        printf("El numero4 (%d) es el menor.\n", numero4);
    }
    else if (numero5 < numero1 && numero5 < numero2 && numero5 < numero3 && numero5 < numero4)
    {
        printf("El numero5 (%d) es el menor.\n", numero5);
    }
    else
    {
        printf("Hay numeros iguales o no se puede determinar un unico menor.\n");
    }

    return 0;
}
