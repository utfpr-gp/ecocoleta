INSERT INTO users (name, email, password, phone, role, activo)
VALUES ('alvaro', 'admin@admin.com', '$2a$10$zNBVSnByhydlUd5m1sTS7erEbEtTrE9xiVtjSukJPHzXj1SStGgzK', '42999660090',
        'ADMIN', true),                          -- passaword: admin--
       ('Separador Teste', 'resident1@teste.com', '$2a$10$i3bOy2CnlO6Mmk63710I0O3.BTTiGDke7ptEXL0Dm.bQgeGr2Dhuy',
        '42999660090', 'RESIDENT', true),        -- passaword: 12345--
       ('Catador  Teste', 'catador1@teste.com', '$2a$10$.J9iJ8m/tFZ2onVabsUY4.TDfSCVVDt4zA8vrUCsrbXL1C9yX1Yha',
        '42999660090', 'WASTE_COLLECTOR', true), -- passaword: 12345--
       ('Empresa Teste', 'empresa1@teste.com', '$2a$10$MRK0pecpBNU3FEKTu2q4FO8ep.hml2eaTUjUXoG0QicJapS32f8vu',
        '42999660090', 'COMPANY', true); -- passaword: 12345--

INSERT INTO residents (id)
VALUES (2);

INSERT INTO waste_collectors (id, cpf)
VALUES (3, '12345678901');

INSERT INTO companys (id, cnpj, company_name)
VALUES (4, '12345678901', 'Empresa Teste');

-- ST_SetSRID: Define o SRID (Sistema de Referência Espacial) da geometria, neste caso, usamos o 4326, que é o SRID padrão para coordenadas GPS (latitude/longitude).
-- ST_MakePoint: Cria um ponto a partir das coordenadas de longitude e latitude, onde o primeiro valor é a longitude e o segundo é a latitude.
-- Valores de latitude e longitude: São inseridos como números reais (sem aspas), pois são coordenadas geográficas.
-- Inserindo dados na tabela address com o campo location geoespacial
INSERT INTO address (name, city, street, number, neighborhood, cep, state, latitude, longitude, location)
VALUES ('Casa', 'Guarapuava', 'Rua Emiliano Perneta', 303, 'Alto da XV', 85065070, 'Paraná', -25.3813, -51.45775,
        ST_SetSRID(ST_MakePoint(-51.45775, -25.3813), 4326)),
       ('Empresa', 'Guarapuava', 'Rua Souza Naves', 77, 'Alto da XV', 85065080, 'Paraná', -25.3800, -51.4573,
        ST_SetSRID(ST_MakePoint(-51.4573, -25.3800), 4326)),
       ('Casa', 'Guarapuava', 'Rua Guaíra', 1379, 'Centro', 85015280, 'Paraná', -25.3808, -51.4558,
        ST_SetSRID(ST_MakePoint(-51.4558, -25.3808), 4326)),
       ('Empresa', 'Guarapuava', 'Rua Benjamin Constant', 862, 'Centro', 85010190, 'Paraná', -25.3888, -51.4628,
        ST_SetSRID(ST_MakePoint(-51.4628, -25.3888), 4326));

-- Vinculando usuários com os endereços
INSERT INTO user_addresses (user_id, address_id)
VALUES (2, 1),
       (2, 2),
       (3, 3),
       (4, 4);

-- INSERT INTO materials (name, score) VALUES
--                                         ('Papel e Papelão - Jornais e revistas', 10),
--                                         ('Papel e Papelão - Folhetos e panfletos', 10),
--                                         ('Papel e Papelão - Caixas de papelão', 10),
--                                         ('Papel e Papelão - Papel sulfite e papel de escritório', 10),
--                                         ('Papel e Papelão - Embalagens de papel', 10),
--                                         ('Plásticos - Garrafas PET (como as de refrigerante)', 10),
--                                         ('Plásticos - Sacos plásticos', 10),
--                                         ('Plásticos - Embalagens plásticas (de alimentos, produtos de limpeza, etc.)', 10),
--                                         ('Plásticos - Tampas plásticas', 10),
--                                         ('Plásticos - Tubos e canos plásticos', 10),
--                                         ('Vidros - Garrafas de vidro (de bebidas, azeite, etc.)', 10),
--                                         ('Vidros - Potes de vidro (de alimentos, cosméticos, etc.)', 10),
--                                         ('Vidros - Vidros de janelas', 10),
--                                         ('Vidros - Frascos de medicamentos (não contaminados)', 10),
--                                         ('Metais - Latas de alumínio (de refrigerantes, cervejas, etc.)', 10),
--                                         ('Metais - Latas de aço (de alimentos enlatados)', 10),
--                                         ('Metais - Ferragens e pregos', 10),
--                                         ('Metais - Alumínio (folhas, embalagens de alimentos, etc.)', 10),
--                                         ('Metais - Cabos e fios metálicos', 10),
--                                         ('Tetrapak - Caixas de leite', 10),
--                                         ('Tetrapak - Embalagens de sucos', 10),
--                                         ('Tetrapak - Embalagens de molhos e outros líquidos', 10),
--                                         ('Eletrônicos - Aparelhos eletrônicos antigos (celulares, computadores, televisores, etc.)', 10),
--                                         ('Eletrônicos - Pilhas e baterias (em locais específicos de coleta)', 10),
--                                         ('Eletrônicos - Cabos e componentes eletrônicos', 10),
--                                         ('Madeira - Paletes', 10),
--                                         ('Madeira - Móveis antigos', 10),
--                                         ('Madeira - Serragem e restos de madeira (em alguns programas de reciclagem específicos)', 10),
--                                         ('Tecidos e Têxteis - Roupas usadas', 10),
--                                         ('Tecidos e Têxteis - Tecidos de algodão, lã, poliéster, etc.', 10),
--                                         ('Tecidos e Têxteis - Panos e retalhos', 10);

-- -- Inserindo 20 coletas fictícias para testes
-- INSERT INTO collects (is_intern, schedule, picture, amount, status, address_id, resident_id, waste_collector_id) VALUES
--                                                                                                                      (false, '2024-09-10 10:00:00', 'collect_1.jpg', 5, 'PENDING', 1, 2, 3),
--                                                                                                                      (true, '2024-09-12 11:30:00', 'collect_2.jpg', 3, 'COMPLETED', 2, 2, 3),
--                                                                                                                      (false, '2024-09-14 14:00:00', 'collect_3.jpg', 7, 'PENDING', 3, 2, NULL),
--                                                                                                                      (true, '2024-09-15 09:00:00', 'collect_4.jpg', 2, 'COMPLETED', 4, 2, 3),
--                                                                                                                      (false, '2024-09-16 08:00:00', 'collect_5.jpg', 10, 'PENDING', 1, 2, 3),
--                                                                                                                      (true, '2024-09-17 12:00:00', 'collect_6.jpg', 6, 'COMPLETED', 2, 2, 3),
--                                                                                                                      (false, '2024-09-18 16:00:00', 'collect_7.jpg', 4, 'PENDING', 3, 2, NULL),
--                                                                                                                      (true, '2024-09-19 18:00:00', 'collect_8.jpg', 8, 'COMPLETED', 4, 2, 3),
--                                                                                                                      (false, '2024-09-20 19:00:00', 'collect_9.jpg', 9, 'PENDING', 1, 2, 3),
--                                                                                                                      (true, '2024-09-21 20:00:00', 'collect_10.jpg', 5, 'COMPLETED', 2, 2, 3),
--                                                                                                                      (false, '2024-09-22 21:00:00', 'collect_11.jpg', 7, 'PENDING', 3, 2, NULL),
--                                                                                                                      (true, '2024-09-23 22:00:00', 'collect_12.jpg', 3, 'COMPLETED', 4, 2, 3),
--                                                                                                                      (false, '2024-09-24 23:00:00', 'collect_13.jpg', 6, 'PENDING', 1, 2, 3),
--                                                                                                                      (true, '2024-09-25 07:00:00', 'collect_14.jpg', 4, 'COMPLETED', 2, 2, 3),
--                                                                                                                      (false, '2024-09-26 08:30:00', 'collect_15.jpg', 9, 'PENDING', 3, 2, NULL),
--                                                                                                                      (true, '2024-09-27 09:45:00', 'collect_16.jpg', 10, 'COMPLETED', 4, 2, 3),
--                                                                                                                      (false, '2024-09-28 10:15:00', 'collect_17.jpg', 5, 'PENDING', 1, 2, 3),
--                                                                                                                      (true, '2024-09-29 11:20:00', 'collect_18.jpg', 7, 'COMPLETED', 2, 2, 3),
--                                                                                                                      (false, '2024-09-30 12:35:00', 'collect_19.jpg', 8, 'PENDING', 3, 2, NULL),
--                                                                                                                      (true, '2024-10-01 14:00:00', 'collect_20.jpg', 6, 'COMPLETED', 4, 2, 3);

-- Inserindo coletas fictícias para testes
INSERT INTO collects (is_intern, schedule, picture, amount, status, materials,
                      is_evaluated, rating, init_time, end_time, address_id, resident_id, waste_collector_id)
VALUES
    -- Coletas PENDING
    (false, '2024-09-10 10:00:00', 'collect_1.jpg', 5, 'PENDING', 'VIDRO,PLASTICO',
     false, NULL, NULL, NULL, 1, 2, 3),
    (false, '2024-09-14 14:00:00', 'collect_3.jpg', 7, 'PENDING', 'PAPEL,VIDRO',
     false, NULL, NULL, NULL, 3, 2, NULL),
    (false, '2024-09-16 08:00:00', 'collect_5.jpg', 10, 'PENDING', 'METAL,PLASTICO',
     false, NULL, NULL, NULL, 1, 2, 3),
    (false, '2024-09-20 19:00:00', 'collect_9.jpg', 9, 'PENDING', 'ELETRONICO,PLASTICO',
     false, NULL, NULL, NULL, 1, 2, 3),
    (false, '2024-09-26 08:30:00', 'collect_15.jpg', 9, 'PENDING', 'PAPEL,PLASTICO',
     false, NULL, NULL, NULL, 3, 2, NULL),

    -- Coletas IN_PROGRESS
    (true, '2024-09-12 10:00:00', 'collect_2.jpg', 5, 'IN_PROGRESS', 'VIDRO,PAPEL',
     false, NULL, '2024-09-12 08:00:00', NULL, 2, 2, 3),
    (false, '2024-09-18 16:00:00', 'collect_7.jpg', 4, 'IN_PROGRESS', 'PLASTICO,METAL',
     false, NULL, '2024-09-18 12:00:00', NULL, 3, 2, NULL),

    -- Coletas COMPLETED (avaliadas)
    (true, '2024-09-12 11:30:00', 'collect_4.jpg', 3, 'COMPLETED', 'VIDRO,PLASTICO',
     true, 5, '2024-09-12 09:00:00', '2024-09-12 11:00:00', 2, 2, 3),
    (true, '2024-09-17 12:00:00', 'collect_6.jpg', 6, 'COMPLETED', 'PAPEL,ELETRONICO',
     true, 4, '2024-09-17 10:00:00', '2024-09-17 11:45:00', 2, 2, 3),
    (true, '2024-09-19 18:00:00', 'collect_8.jpg', 8, 'COMPLETED', 'METAL,PAPEL',
     true, 3, '2024-09-19 14:00:00', '2024-09-19 17:30:00', 4, 2, 3),
    (true, '2024-09-23 22:00:00', 'collect_12.jpg', 3, 'COMPLETED', 'PAPEL,VIDRO',
     true, 5, '2024-09-23 20:00:00', '2024-09-23 21:45:00', 4, 2, 3),

    -- Coletas COMPLETED (não avaliadas)
    (true, '2024-09-29 11:20:00', 'collect_18.jpg', 7, 'COMPLETED', 'ELETRONICO,VIDRO',
     false, NULL, '2024-09-29 08:00:00', '2024-09-29 11:00:00', 2, 2, 3),
    (true, '2024-10-01 14:00:00', 'collect_20.jpg', 6, 'COMPLETED', 'PAPEL,PLASTICO',
     false, NULL, '2024-10-01 11:00:00', '2024-10-01 13:45:00', 4, 2, 3),

    -- Coletas CANCELLED
    (false, '2024-09-24 23:00:00', 'collect_13.jpg', 6, 'CANCELLED', 'PLASTICO,METAL',
     false, NULL, '2024-09-24 18:00:00', NULL, 1, 2, 3),
    (false, '2024-09-30 12:35:00', 'collect_19.jpg', 8, 'CANCELLED', 'VIDRO,PLASTICO',
     false, NULL, '2024-09-30 08:00:00', NULL, 3, 2, NULL),

    -- Coletas PAUSED
    (false, '2024-09-22 21:00:00', 'collect_11.jpg', 7, 'PAUSED', 'ELETRONICO,PAPEL',
     false, NULL, '2024-09-22 08:00:00', NULL, 3, 2, NULL),
    (false, '2024-09-28 10:15:00', 'collect_17.jpg', 5, 'PAUSED', 'METAL,PLASTICO',
     false, NULL, '2024-09-28 06:00:00', NULL, 1, 2, 3);


--
-- --setando o id das tabelas
-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
-- SELECT setval('address_id_seq', (SELECT MAX(id) FROM address));
-- SELECT setval('residents_id_seq', (SELECT MAX(id) FROM residents));
-- SELECT setval('waste_collectors_id_seq', (SELECT MAX(id) FROM waste_collectors));
-- SELECT setval('companys_id_seq', (SELECT MAX(id) FROM companys));
-- SELECT setval('collects_id_seq', (SELECT MAX(id) FROM collects));
-- SELECT setval('evaluations_id_seq', (SELECT MAX(id) FROM evaluations));
-- SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials));
-- SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
-- SELECT setval('exchanges_id_seq', (SELECT MAX(id) FROM exchanges));