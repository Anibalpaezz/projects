#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero1, numero2, numero3;

    // Pedir datos
    printf("Introduce tres numeros enteros separados por espacios: ");
    scanf("%d %d %d", &numero1, &numero2, &numero3);

    // Comprobaciones
    if (numero1 == 1 && numero2 == 2 && numero3 == 3)
    {
        printf("Acceso permitido\n");
    }
    else
    {
        printf("Acceso denegado\n");
    }

    return 0;
}
