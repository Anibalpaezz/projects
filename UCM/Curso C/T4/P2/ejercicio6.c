/* Escriba  un  programa  que  pida  al  usuario  un  número,  y  muestre  el  mensaje  "has
introducido el numero ---" (mostrando el número que ha sido introducido). Esta acción
debe  repetirse  hasta  que  el  usuario  introduzca  el  número  0.  En  ese  momento  se
mostrará  el  mensaje  "Finalizando:  Se  ha  introducido  el  número  0".  Además,  se  debe
mostrar cuántos números se han introducido y su suma.  */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero_usuario, suma = 0, contador = 0;

    // Bucle
    do
    {
        printf("Introduce un número: ");
        scanf("%d", &numero_usuario);
         contador++;
         suma += numero_usuario;
    } while (numero_usuario != 0);

    // Mostrar resultados
    printf("Has introducido el número 0, fin del programa.\n");
    printf("Se han introducido %d números y su suma es %d.\n", contador - 1, suma);

    return 0;
}
