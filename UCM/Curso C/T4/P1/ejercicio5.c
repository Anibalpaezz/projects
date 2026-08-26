#include <stdio.h>
#define PRECIO 7.0
int main(int argc, char const *argv[])
{
    // Variables
    int edad;
    float descuento;

    // Pedir datos
    printf("Bienvenido a la taquilla de cine\n");
    printf("Introduce tu edad: ");
    scanf("%d", &edad);

    // Comprobaciones
    if (edad < 5)
    {
        descuento = PRECIO * 0.4;
        printf("Tu entrada cuesta %.2f euros\n", descuento);
    }
    else if (edad > 60)
    {
        descuento = PRECIO * 0.45;
        printf("Tu entrada cuesta %.2f euros\n", descuento);
    }
    else
    {
        printf("Tu entrada cuesta %.2f euros\n", PRECIO);
    }

    return 0;
}
