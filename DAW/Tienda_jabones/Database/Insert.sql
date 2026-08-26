use jaboneria;

/* Insertando valores */
INSERT INTO productos (nombre, descripcion, peso, precio, imagen) VALUES
('Jabon de Glicerina', 'Limpieza suave para todo tipo de piel', 150, 5, '../Images/glicerina.jpg'),
('Jabon de Aloe Vera', 'Hidratacion y regeneracion cutanea', 120, 7, '../Images/aloe_vera.jpg'),
('Jabon de Lavanda', 'Aroma relajante para un bano tranquilo', 130, 6, '../Images/lavanda.jpg'),
('Jabon de Coco', 'Nutricion y suavidad para la piel', 140, 8, '../Images/coco.jpg'),
('Jabon Antibacterial', 'Elimina bacterias y protege la piel', 160, 9, '../Images/antibacterial.jpg'),
('Jabon Exfoliante', 'Remueve celulas muertas para una piel suave', 125, 10, '../Images/exfoliante.jpg'),
('Jabon de Rosa Mosqueta', 'Regeneracion y rejuvenecimiento', 135, 12, '../Images/rosa_mosqueta.jpg'),
('Jabon de Calendula', 'Calma y alivia la piel irritada', 155, 11, '../Images/calendula.jpg'),
('Jabon de Avena', 'Suavidad y nutricion para pieles sensibles', 145, 8, '../Images/avena.jpg'),
('Jabon de Miel Eco', 'Hidratacion y brillo natural', 130, 9, '../Images/miel.jpg'),
('Jabon de Hierbas', 'Mezcla de hierbas para una experiencia fresca', 140, 7, '../Images/hierbas.jpg'),
('Jabon de Argan', 'Nutricion intensiva para una piel radiante', 150, 13, '../Images/argan.jpg'),
('Jabon de Manzanilla', 'Calma y suaviza la piel sensible', 125, 6, '../Images/manzanilla.jpg'),
('Jabon de Tea Tree', 'Propiedades antimicrobianas y purificantes', 135, 10, '../Images/tea_tree.jpg'),
('Jabon de Vainilla', 'Aroma dulce y suavidad para la piel', 145, 11, '../Images/vainilla.jpg'),
('Jabon de Almendras', 'Nutricion y aroma delicado', 155, 9, '../Images/almendras.jpg'),
('Jabon de Menta', 'Sensacion refrescante y limpieza profunda', 130, 8, '../Images/menta.jpg'),
('Jabon de Curcuma', 'Propiedades antiinflamatorias y revitalizantes', 140, 12, '../Images/curcuma.jpg'),
('Jabon de Jazmin', 'Aroma floral y cuidado para la piel', 150, 14, '../Images/jazmin.jpg'),
('Jabon de Sal Marina', 'Exfoliacion y remineralizacion', 160, 15, '../Images/sal_marina.jpg');

UPDATE productos SET precio = 8.75 WHERE precio <> 8.75;

/* Insertando valores */
INSERT INTO administradores (usuario, pass) VALUES
('anibal', 'nico'),
('nico', 'nico');

/* Insertando valores */
INSERT INTO clientes (email, pass, nombre, direccion, CP, telefono) VALUES
('carlos@carlos.com', 'nico', 'Carlos', 'Calle 123', 12345, '123456789'),
('maria@maria.com', 'nico', 'María', 'Avenida 456', 67890, '234567890'),
('pedro@pedro.com', 'nico', 'Pedro', 'Plaza 789', 54321, '345678901');

/* Insertando valores */
/* INSERT INTO pedidos (email, fecha_pedido, fecha_entrega, total_pedido, entregado)
VALUES 
('carlos@carlos.com', CURDATE() - INTERVAL 1 DAY, CURDATE() - INTERVAL 1 DAY, 1, FALSE),
('carlos@carlos.com', CURDATE() - INTERVAL 1 DAY, CURDATE() - INTERVAL 1 DAY, 1, FALSE); */






