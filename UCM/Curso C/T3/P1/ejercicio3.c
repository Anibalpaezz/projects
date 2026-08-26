/* Escriba  un  programa  que  calcule  el  interés  que  se  obtiene  por  un  determinado  dinero
depositado en un banco. Para ello el programa preguntará por el capital inicial y por el
tipo de interés. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float dinero_inicial, dinero_final, interes;
    int años;

    // Pedir los datos
    printf("Bienvenido al calculador de intereses compuestos.\n");
    printf("Introduce la cantidad inicial de dinero: ");
    scanf("%f", &dinero_inicial);
    printf("Introduce el número de años que el dinero estará invertido: ");
    scanf("%d", &años);
    printf("Introduce la tasa de interés anual (en formato decimal, por ejemplo, 0.05 para 5%%): ");
    scanf("%f", &interes);

    // Calculos
    for (int i = 0; i < años; i++)
    {
        dinero_inicial += dinero_inicial * interes;
    }
    dinero_final = dinero_inicial;

    printf("Después de %d años, el dinero invertido crecerá a %.2f\n", años, dinero_final);
    return 0;
}

