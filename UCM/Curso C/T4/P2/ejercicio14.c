#include <stdio.h>

int main(int argc, char const *argv[])
{
    float u_vendidas, p_unitario, total;
    int contador = 0;

    do
    {
        printf("Introduce el numero de unidades vendidas del articulo %d: ", contador + 1);
        scanf("%f", &u_vendidas);
        if (u_vendidas <= 0)
        {
            break;
        }
        printf("Introduce el precio unitario del articulo %d: ", contador + 1);
        scanf("%f", &p_unitario);
        total += u_vendidas * p_unitario;
        contador++;
    } while (u_vendidas > 0);

    printf("Total de ventas: %.2f\n", total);
    printf("Número de transacciones: %d\n", contador);

    return 0;
}
