/* Modificar  el  ejercicio  11  para  que  el  número  máximo  de  intentos  sea  5.  Al
terminar  el  programa  indicará  si  el  usuario  ha  ganado  (si  ha  adivinado  el  número  en
menos de cinco intentos) o no. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    const int numero_secreto = 69;
    int numero_usuario, intentos = 0;
    do
    {
        printf("Introduce un número entre 1 y 100: ");
        scanf("%d", &numero_usuario);
        intentos++;

        if (numero_usuario < numero_secreto)
        {
            printf("El número introducido es menor que el número secreto.\n");
        }
        else if (numero_usuario > numero_secreto)
        {
            printf("El número introducido es mayor que el número secreto.\n");
        }
    } while (numero_usuario != numero_secreto && intentos < 5);

    printf("Número de intentos: %d\n", intentos);
    if (intentos < 5)
    {
        printf("Enhorabuena!\n");
    }
    else
    {
        printf("Debe practicar más.\n");
    }

    return 0;
}
