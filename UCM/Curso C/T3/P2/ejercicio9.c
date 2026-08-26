/* Escriba un programa que declare una variable de tipo entero x y una variable y de tipo
real, asigne a dichas variables los valores 6 y 2.0, respectivamente, y calcule y muestre
por pantalla el resultado de las siguientes operaciones: a) x*y b) x/y c) x%y
 ¿Qué sucede al intentar compilar el programa? ¿Cómo resolvería este problema? */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int x = 6;
    float y = 2.0;

    // Procesar datos
    printf("Resultado de la multiplicacion entre %d y %.2f es %.2f\n", x, y, x * y);
    printf("Resultado de la division entre %d y %.2f es %.2f\n", x, y, x / y);
    printf("Resultado del resto de la division entre %d y %.2f es %.2f\n", x, y, (int)x % (int)y);

    return 0;
}
