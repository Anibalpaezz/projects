/* Escribir  un  programa  en  C  que  escriba  los  números  comprendidos  entre  1  y  1000.  El
programa escribirá en la pantalla los números en grupos de 20, solicitando al usuario si
quiere  o  no  continuar  visualizando  el  siguiente  grupo  de  números.  Generalizar  el
programa para que escriba los números comprendidos entre dos valores que introduzca
el  usuario,  y  sea  éste  también  quien  decida  el  tamaño  del  grupo  a  visualizar  por
pantalla. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    /* Variables */
    int min, max;
    char opcion;

    /* Funcionamiento */
    printf("Quieres introducir tu la horquilla? (s/n): ");
    scanf("%c", &opcion);

    if (opcion == 's' || opcion == 'S')
    {
        printf("Introduce el valor mínimo: ");
        scanf("%d", &min);
        printf("Introduce el valor máximo: ");
        scanf("%d", &max);
    }
    else
    {
        /*  */
        min = 1;
        max = 1000;
    }

    /* Mostrar los valores */
    for (int i = min; i <= max; i++)
    {
        printf("%d ", i);

        if ((i - min + 1) % 20 == 0)
        {
            printf("\n¿Quieres continuar? (s/n): ");
            scanf(" %c", &opcion);

            if (opcion == 'n' || opcion == 'N')
            {
                break;
            }
        }
    }

    return 0;
}
