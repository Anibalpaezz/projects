#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero;

    // Pedir datos
    printf("Bienvenido al programa de verificacion de paridad\n");
    printf("Introduce un numero entero cualquiera: ");
    scanf("%d", &numero);

    // Comprobaciones
    if (numero % 2 == 0)
    {
        printf("El numero %d es par\n", numero);
    }
    else
    {
        if (numero % 3 == 0)
        {
            printf("El numero %d es impar y multiplo de 3\n", numero);
        }
        else
        {
            printf("El numero %d es impar y no es multiplo de 3\n", numero);
        }
    }

    return 0;
}
