#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero1, numero2;

    // Pedir datos
    printf("Bienvenido al comparador de numeros\n");
    printf("Introduce dos numeros enteros separados por espacio: ");
    scanf("%d %d", &numero1, &numero2);

    // Comprobaciones
    if (numero1 > numero2)
    {
        printf("El numero %d es mayor que %d\n", numero1, numero2);
    } else if (numero1 < numero2)
    {
        printf("El numero %d es menor que %d\n", numero1, numero2);
    } else
    {
        printf("Los numeros %d y %d son iguales\n", numero1, numero2);
    }

    return 0;
}
