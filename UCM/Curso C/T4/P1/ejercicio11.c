#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    char letra;

    // Pedir datos
    printf("Ingrese una letra: ");
    scanf(" %c", &letra);

    // Comprobaciones
    switch (letra)
    {
    case 'a':
        printf("La letra %c es una vocal.\n", letra);
        break;
    case 'e':
        printf("La letra %c es una vocal.\n", letra);
        break;
    case 'i':
        printf("La letra %c es una vocal.\n", letra);
        break;
    case 'o':
        printf("La letra %c es una vocal.\n", letra);
        break;
    case 'u':
        printf("La letra %c es una vocal.\n", letra);
        break;

    default:
        printf("La letra %c no es una vocal.\n", letra);
        break;
    }

    return 0;
}

