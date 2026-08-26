#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero1, numero2;

    // Pedir datos
    printf("Bienvenido al programa\n");
    printf("Introduce los numeros separados por espacio: ");
    scanf("%d %d", &numero1, &numero2);

    // Comparar los numeros
    if (numero1 % numero2 == 0)
    {
        printf("El numero %d es divisible por %d\n", numero1, numero2);
    } else
    {
        printf("El numero %d no es divisible por %d\n", numero1, numero2);
    }

    return 0;
}
