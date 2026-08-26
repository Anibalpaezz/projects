module A where

-- Division es una funcion, toma dos enteros y devuelve un entero
doble x = x + x
division :: Int -> Int -> Int
division x y = x `div` y
-- Escribimos en terminal division y dos numeros espaciados para obtener el resultado

-- Funciones de listas
lista [1..20] -- Devuelve una lista con los numeros del 1 al 20
lista2 [1,3..20] -- Devuelve una lista con los numeros del 1 al 20 de 2 en 2, es decir, los numeros impares


head [1,2,3] -- Devuelve el primer elemento de la lista, en este caso 1
tail [1,2,3] -- Devuelve la lista sin el primer elemento, en este caso [2,3]
last [1,2,3] -- Devuelve el ultimo elemento de la lista, en este caso 3
init [1,2,3] -- Devuelve la lista sin el ultimo elemento, en este caso [1,2]
length [1,2,3] -- Devuelve la longitud de la lista, en este caso 3
null [] -- Devuelve True si la lista esta vacia, en este caso True
reverse [1,2,3] -- Devuelve la lista al reves, en este caso [3,2,1]
take 2 [1,2,3] -- Devuelve los primeros n elementos de la lista, en este caso [1,2]
drop 2 [1,2,3] -- Devuelve la lista sin los primeros n elementos, en este caso [3]
maximum [1,2,3] -- Devuelve el elemento maximo de la lista, en este caso 3
minimum [1,2,3] -- Devuelve el elemento minimo de la lista, en este caso 1
sum [1,2,3] -- Devuelve la suma de los elementos de la lista, en este caso 6
product [1,2,3] -- Devuelve el producto de los elementos de la lista, en este caso 6
elem 2 [1,2,3] -- Devuelve True si el elemento esta en la lista, en este caso True

-- Forma de escribir un if en Haskell
if

{-

-- Operaciones que se pueden hacer directamente en terminal con preludio
    Integer
        Suma: 2 + 3
        Resta: 5 - 2
        Multiplicacion: 4 * 3
        Division: 10 `div` 2 o 10 / 2 (division con decimales)
        Modulo: 10 `mod` 3

    String
        Concatenacion: "Hola " ++ "Mundo"
        Longitud: length "Hola"

    Bool
        Operadores logicos: && (and), || (or), not
        Comparaciones: ==, /=, <, >, <=, >=

-- Declarar variables en terminal
    x :: Int -> Int -> Int; suma x y = x + y

-- Funciones de la terminal
    :t para conocer el tipo de una funcion o valor
    :l para cargar un archivo con funciones definidas
    :r para recargar el archivo despues de hacer cambios
    :q para salir de la terminal

-}



