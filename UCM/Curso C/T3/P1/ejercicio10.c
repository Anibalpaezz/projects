/* Escriba un programa en  el que se declaren dos variables, a  y b, se pida un valor para
cada una de ellas, y se intercambien dichos valores. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int a, b, temp;

    // Pedir los datos
    printf("Intercambiador de valores.\n");
    printf("Introduce el valor de a: ");
    scanf("%d", &a);
    printf("Introduce el valor de b: ");
    scanf("%d", &b);

    // Intercambio de valores
    temp = a;
    a = b;
    b = temp;

    // Mostrar resultados
    printf("Después del intercambio:\n");
    printf("a = %d\n", a);
    printf("b = %d\n", b);

    return 0;
}
