#include <stdio.h>

int main(int argc, char const *argv[])
{
    //Variables
    int numero;

    // Pedir datos
    printf("Bienvenido al comprobador de numeros\n");
    printf("Introduce un numero entero cualquiera: ");
    scanf("%d", &numero);

    // Comprobar si es mayor que 100
    if (numero > 100)
    {
        printf("El numero %d es mayor que 100\n", numero);
    } else
    {
        printf("El numero %d no es mayor que 100\n", numero);
    }

    return 0;
}
