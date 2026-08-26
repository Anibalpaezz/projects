#include <stdio.h>
#include <math.h>

int main(int argc, char const *argv[])
{
    // Variables
    int seleccion;

    // Pedir datos
    printf("     CALCULO DE AREAS\n==========================\n");
    printf("1. Area de un triangulo\n");
    printf("2. Area de un trapecio\n");
    printf("3. Area de un rectangulo\n");
    printf("Seleccione una opcion: ");
    scanf("%d", &seleccion);

    // Comprobaciones
    switch (seleccion)
    {
    case 1:
        float base, altura, area_triangulo;
        printf("Ingrese la base del triangulo: ");
        scanf("%f", &base);
        printf("Ingrese la altura del triangulo: ");
        scanf("%f", &altura);
        area_triangulo = (base * altura) / 2;
        printf("El area del triangulo es: %.2f\n", area_triangulo);
        break;
    case 2:
        float base_mayor, base_menor, altura_trapecio, area_trapecio;
        printf("Ingrese la base mayor del trapecio: ");
        scanf("%f", &base_mayor);
        printf("Ingrese la base menor del trapecio: ");
        scanf("%f", &base_menor);
        printf("Ingrese la altura del trapecio: ");
        scanf("%f", &altura_trapecio);
        area_trapecio = ((base_mayor + base_menor) * altura_trapecio) / 2;
        printf("El area del trapecio es: %.2f\n", area_trapecio);
        break;
    case 3:
        float largo, ancho, area_rectangulo;
        printf("Ingrese el largo del rectangulo: ");
        scanf("%f", &largo);
        printf("Ingrese el ancho del rectangulo: ");
        scanf("%f", &ancho);
        area_rectangulo = largo * ancho;
        printf("El area del rectangulo es: %.2f\n", area_rectangulo);
        break;

    default:
        printf("Seleccion invalida. Por favor elija una opcion del 1 al 3.\n");
        break;
    }

    return 0;
}

