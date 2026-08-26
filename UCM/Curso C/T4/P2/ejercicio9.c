/* Escriba  un  programa  en  C  que  solicite  10  números  enteros  positivos  al  usuario  y
calcule y muestre los siguientes valores:
• La suma de todos los números leídos.
• La media de los números.
• El mayor número introducido.
• El menor número introducido.  */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int numero, suma = 0, mayor = 0, menor;
    float media = 0.0;

    // Inicialización
    for (size_t i = 0; i < 10; i++)
    {
        printf("Ingrese un numero entero: ");
        scanf("%d", &numero);
        suma += numero;
        media = suma / (i + 1);
        if (numero > mayor || i == 0)
        {
            mayor = numero;
        }
        if (numero < menor || i == 0)
        {
            menor = numero;
        }

    }

    printf("La suma de los numeros es: %d\n", suma);
    printf("La media de los numeros es: %.2f\n", media);
    printf("El numero mayor es: %d\n", mayor);
    printf("El numero menor es: %d\n", menor);

    return 0;
}
