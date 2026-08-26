/* Escriba un programa que pida al usuario su nombre y contraseña y le de tres
oportunidades  para  introducir  los  datos  correctos,  que  serán  root  y  1234.  Si  los  datos
introducidos son correctos se mostrará por pantalla “Bienvenido al sistema”. En caso
contrario se mostrará un mensaje por pantalla indicando que se ha superado el número
de intentos permitido. Notas:
Puesto que las cadenas de caracteres finalizan con el carácter nulo (‘\0’), usuario y
contraseña  se  declararán  como  cadenas  de  longitud  5  (char  usuario[5]).  Para  leer
cualquiera de estas cadenas con la función scanf se usará el descriptor de formato %s y
dado  que  el  nombre  de  la  cadena  ya  es  una  dirección,  éste  no  debe  ir  precedido  del
símbolo &(scanf(“%s”, usuario)). Para  comparar  cadenas  se  debe  usar  la  función  strcmp  (string  compare),  por  ejemplo
strcmp(usuario,  "root"),  que  devolverá  un  0  si  las  cadenas  son  iguales  y  otro  valor  si
son distintas.  */

#include <stdio.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    // Variables
    char usuario[5] = {'r', 'o', 'o', 't', '\0'};
    char passwd[5] = {'1', '2', '3', '4', '\0'};

    int contador = 0;

    // Bucle
    do
    {
        printf("Ingrese el usuario: ");
        char usuario_entrada[5];
        scanf("%4s", usuario_entrada);
        printf("Ingrese la contraseña: ");
        char passwd_entrada[5];
        scanf("%4s", passwd_entrada);

        if (strcmp(usuario_entrada, usuario) == 0 && strcmp(passwd_entrada, passwd) == 0)
        {
            printf("Bienvenido al sistema\n");
            break;
        }
        else if (strcmp(usuario_entrada, usuario) != 0 && strcmp(passwd_entrada, passwd) == 0)
        {
            printf("Usuario incorrecto pero la contraseña es correcta\n");
        }
        else if (strcmp(usuario_entrada, usuario) == 0 && strcmp(passwd_entrada, passwd) != 0)
        {
            printf("Contraseña incorrecta pero el usuario es correcto\n");
        }
        else
        {
            printf("Usuario y contraseña incorrectos\n");
        }

        contador++;

    } while (contador < 3);

    if (contador == 3) {
        printf("Se ha superado el número de intentos permitido\n");
    }

    return 0;
}
