#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float x1, x2, y1, y2, m;

    // Pedir datos
    printf("Punto A (x1, y1)\n");
    printf("Ingrese el valor de x1: ");
    scanf("%f", &x1);
    printf("Ingrese el valor de y1: ");
    scanf("%f", &y1);
    printf("Punto B (x2, y2)\n");
    printf("Ingrese el valor de x2: ");
    scanf("%f", &x2);
    printf("Ingrese el valor de y2: ");
    scanf("%f", &y2);

    // Calculos
    if (x2 - x1 != 0)
    {
        m = (y2 - y1) / (x2 - x1);
        printf("La pendiente de la recta que une los puntos A y B es: %.2f\n", m);
    }
    else
    {
        printf("La pendiente es indefinida (recta vertical)\n");
    }

    return 0;
}
