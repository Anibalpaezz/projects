/* Escriba un programa en el que se declare una variable de tipo entero y se le asigne un
valor. El programa debe mostrar el valor de la variable y la dirección de memoria en la
que se almacena. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero = 3;
    int *pNumero = &numero;

    // Imprimir valores
    printf("Valor de numero: %d\n", numero);
    printf("Valor en memoria: %p\n", (void *)pNumero);

    return 0;
}
