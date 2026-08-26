#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero;

    // Pedir datos
    printf("Ingrese un numero del 1 al 12: ");
    scanf("%d", &numero);

    // Comprobaciones
    if (numero >= 1 && numero <= 12)
    {
        switch (numero)
        {
        case 1:
            printf("As\n");
            break;
        case 10:
            printf("Sota\n");
            break;
        case 11:
            printf("Caballo\n");
            break;
        case 12:
            printf("Rey\n");
            break;
        default:
            printf("No es as ni figura\n");
            break;
        }
    }
    else
    {
        printf("Numero no valido en una baraja española\n");
    }

    return 0;
}
