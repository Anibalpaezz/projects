DROP DATABASE IF EXISTS MIMESA;
CREATE DATABASE IF NOT EXISTS MIMESA CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE MIMESA;

DROP TABLE IF EXISTS mesa;
CREATE TABLE mesa(
numMesa int(2) not null,
restaurante varchar(50) not null,
capacidad int(2) not null,
nfila int(1) not null,
ncolumna int(1) not null,
ubicacion varchar(40) not null,
primary key (numMesa,restaurante)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserts for 'El Bodegón' restaurant
INSERT INTO mesa VALUES (01, 'El Bodegón', 2, 1, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (02, 'El Bodegón', 4, 1, 2, 'Pasillo central');
INSERT INTO mesa VALUES (03, 'El Bodegón', 4, 1, 3, 'Ventana');
INSERT INTO mesa VALUES (04, 'El Bodegón', 2, 2, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (05, 'El Bodegón', 4, 2, 2, 'Pasillo central');
INSERT INTO mesa VALUES (06, 'El Bodegón', 4, 2, 3, 'Ventana');
INSERT INTO mesa VALUES (07, 'El Bodegón', 8, 3, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (08, 'El Bodegón', 8, 3, 2, 'Pasillo central');
INSERT INTO mesa VALUES (09, 'El Bodegón', 8, 3, 3, 'Ventana');

-- Inserts for 'Las Tres Torres' restaurant
INSERT INTO mesa VALUES (01, 'Las Tres Torres', 2, 1, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (02, 'Las Tres Torres', 4, 1, 2, 'Pasillo central');
INSERT INTO mesa VALUES (03, 'Las Tres Torres', 4, 1, 3, 'Ventana');
INSERT INTO mesa VALUES (04, 'Las Tres Torres', 2, 2, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (05, 'Las Tres Torres', 4, 2, 2, 'Pasillo central');
INSERT INTO mesa VALUES (06, 'Las Tres Torres', 4, 2, 3, 'Ventana');
INSERT INTO mesa VALUES (07, 'Las Tres Torres', 4, 3, 1, 'Pasillo Principal');
INSERT INTO mesa VALUES (08, 'Las Tres Torres', 8, 3, 2, 'Pasillo central');
INSERT INTO mesa VALUES (09, 'Las Tres Torres', 8, 3, 3, 'Ventana');


drop table if exists reservas;
create table reservas(
numMesa int(2) not null,
restaurante varchar(50) not null,
email varchar(50) not null,
fecha date not null,
hora time not null,
estado enum('L','R','O','PI','EC','S','C','PA'),
numPersonas int(2),
primary key (numMesa,restaurante,email,fecha,hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO reservas VALUES (02, 'El Bodegón', 'maria@gmail.com', '2024/05/31', '14:00', 'R', 4);
INSERT INTO reservas VALUES (03, 'El Bodegón', 'manuel@gmail.com', '2024/05/31', '14:00', 'R', 4);
INSERT INTO reservas VALUES (06, 'El Bodegón', 'juanjo@gmail.com', '2024/05/31', '14:00', 'R', 4);
INSERT INTO reservas VALUES (09, 'El Bodegón', 'adriana@gmail.com', '2024/05/31', '14:00', 'C', 4);
UPDATE reservas
SET fecha = '2024-03-09'
WHERE fecha = '2024-05-31';


DROP TABLE IF EXISTS usuario;
CREATE TABLE usuarios (
    ID INT AUTO_INCREMENT primary key,
    usuario VARCHAR(10),
    pass VARCHAR(50) not null,
    permisos BOOLEAN default false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserts for the usuarios table
INSERT INTO usuarios (usuario, pass, permisos)
VALUES ('anibal', 'nico', true);

INSERT INTO usuarios (usuario, pass, permisos)
VALUES ('nico', 'nico', false);


