/*  Escribir un programa en  C para adivinar un número entre 1  y 100 que previamente se
ha  definido  como  una  constante.  El  programa  irá  pidiendo  números  al  usuario  y,
siempre que dicho número no coincida con el número secreto, le indicará si el número
introducido es mayor o menor que el número secreto que tiene que adivinar. Al final, el
programa  indicará  la  cantidad  de  intentos  que  se  han  necesitado  para  adivinar  el
número. Si el número de intentos es menor que 5 se mostrará “Enhorabuena!”. Si es un
valor  entre  5  y  10  se mostrará el mensaje “No está mal”. Si el número de intentos es
mayor que 10 se mostrará el mensaje “Debe practicar más”.  */

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
    } while (numero_usuario != numero_secreto);

    printf("Número de intentos: %d\n", intentos);
    if (intentos < 5)
    {
        printf("Enhorabuena!\n");
    }
    else if (intentos >= 5 && intentos <= 10)
    {
        printf("No está mal.\n");
    }
    else
    {
        printf("Debe practicar más.\n");
    }

    return 0;
}
