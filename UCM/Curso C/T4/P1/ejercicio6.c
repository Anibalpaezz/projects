#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int x, resultado;

    // Pedir datos
    printf("Bienvenido al calculador de funciones matematicas\n");
    printf("La funcion de hoy es \n f(x) = x + 3 si x <= 0 y f(x) = x^2 + 2x si x > 0\n");
    printf("Introduce el valor de x: ");
    scanf("%d", &x);

    // Comprobaciones
    if (x <= 0)
    {
        resultado = x + 3;
        printf("El resultado de f(%d) es %d\n", x, resultado);
    }
    else
    {
        resultado = x * x + 2 * x;
        printf("El resultado de f(%d) es %d\n", x, resultado);
    }

    return 0;
}
