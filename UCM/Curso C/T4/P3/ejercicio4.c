#include <stdio.h>
#include <math.h>

int main()
{
    // Definimos variables
    int numero, decimales;
    double raiz = 1.0, incremento;

    // Pedimos al usuario el número y los decimales
    printf("Ingrese un número: ");
    scanf("%d", &numero);
    printf("Ingrese el número de decimales: ");
    scanf("%d", &decimales);

    // Bucle principal para calcular la raíz cuadrada con la precisión deseada
    for (int vuelta = 0; vuelta <= decimales; vuelta++)
    {
        incremento = pow(10, -vuelta);

        while (raiz * raiz < numero)
        { // subir hasta pasarse
            raiz += incremento;
        }

        if (raiz * raiz == numero)
            break;

        raiz -= incremento; // dar un paso atrás
    }

    printf("La raíz cuadrada de %d con %d decimales es: %.*f\n",
           numero, decimales, decimales, raiz);

    return 0;
}
