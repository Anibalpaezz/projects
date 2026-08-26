/* Escriba  un  programa  que  lea  números  por  teclado  hasta  que  se  introduzca  el  cero.  En
ese  momento  deberá  representar  el  número  de  introducciones  efectuadas,  y  la  mayor
secuencia de números consecutivos iguales, indicando cuál fue el número que se repitió
y cuántas veces seguidas apareció. Ejemplo:  Si  se  introduce  8 8 8 4 5 6 6 6 7 7 7 7 2 0, el resultado a mostrar será. ‘El número más repetido es el 7 y se ha escrito 4 veces’.  */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Declaración de variables
    int numero, contador = 0, max_repeticiones = 0, numero_mas_repetido = 0, repeticiones_actuales = 1;

    // Lectura de números hasta que se introduzca el cero
    while (1) {
        printf("Introduce un número (0 para terminar): ");
        scanf("%d", &numero);

        if (numero == 0) {
            break; // Salir del bucle si se introduce el cero
        }

        contador++; // Incrementar el contador de introducciones

        // Verificar si el número actual es igual al anterior
        if (contador > 1 && numero == numero_mas_repetido) {
            repeticiones_actuales++; // Incrementar las repeticiones actuales
        } else {
            repeticiones_actuales = 1; // Reiniciar las repeticiones actuales
        }

        // Actualizar el número más repetido y su conteo si es necesario
        if (repeticiones_actuales > max_repeticiones) {
            max_repeticiones = repeticiones_actuales;
            numero_mas_repetido = numero;
        }
    }

    // Mostrar el resultado
    if (contador > 0) {
        printf("El número más repetido es el %d y se ha escrito %d veces.\n", numero_mas_repetido, max_repeticiones);
    } else {
        printf("No se introdujeron números.\n");
    }


    return 0;
}
