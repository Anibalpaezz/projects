#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero, contador = 0, suma = 0;
    do
    {
        printf("Ingrese un numero: ");
        scanf("%d", &numero);
        contador++;
        suma += numero;
    } while (suma < 100 && contador < 10);

    printf("Se llego al limite del programa.\n");

    return 0;
}
