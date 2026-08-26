#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero, factorial;

    // Pedir al usuario que introduzca un número
    printf("Introduce un número: ");
    scanf("%d", &numero);

    // Funcionamiento del programa
    factorial = 1;
    for (size_t i = 1; i <= numero; i++)
    {
        factorial *= i;
    }
    printf("El factorial de %d es: %d\n", numero, factorial);

    return 0;
}

