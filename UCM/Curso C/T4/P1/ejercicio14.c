#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Variables
    float salario_hora, salario_semanal, horas_normales, horas_extra;

    // Pedir datos
    printf("Ingrese el salario por hora: ");
    scanf("%f", &salario_hora);
    printf("Ingrese las horas trabajadas: ");
    scanf("%f", &horas_normales);

    // Comprobaciones
    horas_extra = horas_normales - 40;
    horas_normales = horas_normales - horas_extra;
    if (horas_normales + horas_extra >= 50)
    {
        salario_semanal = (horas_normales * salario_hora) + (horas_extra * (salario_hora * 2));
        printf("El salario semanal es: %.2f\n", salario_semanal);
    }
    else if (horas_normales + horas_extra > 40 && horas_normales + horas_extra < 50)
    {
        salario_semanal = (horas_normales * salario_hora) + (horas_extra * (salario_hora * 1.5));
        printf("El salario semanal es: %.2f\n", salario_semanal);
    }
    else
    {
        salario_semanal = horas_normales * salario_hora;
        printf("El salario semanal es: %.2f\n", salario_semanal);
    }

    return 0;
}

