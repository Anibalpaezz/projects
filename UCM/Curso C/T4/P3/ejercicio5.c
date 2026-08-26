/* Se quiere averiguar el número mágico de una persona. Para calcularlo se suman todos
los números de su fecha de nacimiento y a continuación se reducen a un solo dígito. Ejemplo: Fecha de nacimiento: 05/02/1973 5 + 2 + 1973 = 1980 => 1 + 9 + 8 + 0 = 18 =>9 */

#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    int dia, mes, anyo, suma = 0;

    // Pedir al usuario su fecha de nacimiento
    printf("Introduce tu fecha de nacimiento (dd/mm/yyyy): ");
    scanf("%d/%d/%d", &dia, &mes, &anyo);

    // Sumar los números de la fecha de nacimiento
    suma = dia + mes + anyo;

    // Reducir la suma a un solo dígito
    while (suma >= 10)
    {
        int temp = 0;
        while (suma > 0)
        {
            temp += suma % 10;
            suma /= 10;
        }
        suma = temp;
    }

    // Imprimir el número mágico
    printf("Tu número mágico es: %d\n", suma);

    return 0;
}

