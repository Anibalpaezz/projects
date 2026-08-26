/* Escriba  un  programa  que  lea  tres  enteros  (a,  b,  c)  y  muestre  por  pantalla  un  1  si  los
valores introducidos siguen un orden creciente (a>b>c) y 0 en caso contrario. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int a, b, c;

    // Pedir datos
    printf("Comprobador de orden de tres numeros\n");
    printf("Ingrese tres numeros enteros separados por espacios: ");
    scanf("%d %d %d", &a, &b, &c);

    // Procesar datos
    printf("%d\n", ((a < b) && (b < c)));

    return 0;
}
