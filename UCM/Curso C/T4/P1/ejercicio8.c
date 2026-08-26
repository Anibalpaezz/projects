#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero, decenas, unidades;

    // Pedir datos
    printf("Introduce un numero entero: ");
    scanf("%d", &numero);

    // Comprobaciones
    if (numero > 9 && numero <= 99)
    {
        decenas = numero / 10;
        unidades = numero % 10;

        // Paridad
        int pares = 0;
        if (unidades % 2 == 0 && decenas % 2 == 0)
        {
            pares = 2;
        }
        else if (unidades % 2 == 0 || decenas % 2 == 0)
        {
            pares = 1;
        }
        else
        {
            pares = 0;
        }

        int suma = decenas + unidades;
        printf("La suma de las cifras es: %d\n", suma);
        printf("Cantidad de cifras pares: %d\n", pares);
    }
    else
    {
        printf("El numero introducido no es de dos cifras.\n");
    }

    return 0;
}
