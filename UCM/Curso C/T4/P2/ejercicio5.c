/* Escriba  un  programa  en  C  que  genere  la  siguiente  serie:  5,10,15,20,25,30...  El
programa preguntará primero cuantos términos se quieren mostrar  y después mostrará
la serie correspondiente. */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int terminos;

    // Pedir datos
    printf("¿Cuántos términos de la serie quieres mostrar?: ");
    scanf("%d", &terminos);

    for (size_t i = 0; i < terminos; i++)
    {
        printf("%d ", (i + 1) * 5);
    }

    return 0;
}
