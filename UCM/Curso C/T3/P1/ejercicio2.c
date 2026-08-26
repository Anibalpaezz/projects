/* Escriba  un  programa  en  el  que  se  declaren  tres  variables,  a,  b  y  c  y  se  asigne  a  esas
variables  los  valores  5,  7  y  9  respectivamente.  El  programa  deberá  entonces  calcular
su suma y mostrar el resultado. Modifíquelo para que los valores de las variables sean
introducidos por el usuario. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables fijas
    int a = 5;
    int b = 7;
    int c = 9;

    // Suma de fijas
    int suma = a + b + c;
    printf("La suma de %d, %d y %d es %d\n", a, b, c, suma);

    // Variables de usuario
    int numero1, numero2, numero3;
    printf("Introduce tres números enteros separados por espacios: ");
    scanf("%d %d %d", &numero1, &numero2, &numero3);

    // Suma de usuario
    int suma_usuario = numero1 + numero2 + numero3;
    printf("La suma de %d, %d y %d es %d\n", numero1, numero2, numero3, suma_usuario);

    return 0;
}

