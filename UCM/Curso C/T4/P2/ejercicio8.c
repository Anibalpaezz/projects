/* Escriba  un  programa  que  eleve  un  número  a  una  potencia,  utilizando  dos  métodos:  a)
utilizando  la  función  potencia  y  b)  usando  un  bucle,  sin  recurrir  al  operador  potencia.
Nota: En C, para poder usar la función potencia (pow(x, y)=xy) es necesario incluir la
biblioteca math (#include <math.h>).   */

#include <stdio.h>
#include <math.h>

int main(int argc, char const *argv[])
{
    // Variables
    int potencia = 5, numero = 7, potencia_pow, potencia_bucle;

    // Operativa
    printf("El numero es: %d\n", numero);

    potencia_pow = pow(numero, potencia);
    printf("El numero elevado con pow a la quinta potencia es: %d\n", potencia_pow);

    potencia_bucle = numero;
    for (size_t i = 0; i < (potencia -1); i++)
    {
        potencia_bucle = potencia_bucle * numero;
    }
    printf("El numero elevado con bucle a la quinta potencia es: %d\n", potencia_bucle);

    return 0;
}
