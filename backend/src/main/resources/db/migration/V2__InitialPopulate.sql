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

-- Inserindo coletas fictícias para testes
INSERT INTO collects (amount, status, materials, is_evaluated, rating, init_time, end_time, address_id, resident_id, waste_collector_id)
VALUES
    -- Coletas PENDING
    (5, 'PENDING', 'VIDRO,PLASTICO', false, NULL, NULL, NULL, 1, 2, 3),
    (7, 'PENDING', 'PAPEL,VIDRO', false, NULL, NULL, NULL, 3, 2, NULL),
    (10, 'PENDING', 'METAL,PLASTICO', false, NULL, NULL, NULL, 1, 2, 3),
    (9, 'PENDING', 'ELETRONICO,PLASTICO', false, NULL, NULL, NULL, 1, 2, 3),
    (9, 'PENDING', 'PAPEL,PLASTICO', false, NULL, NULL, NULL, 3, 2, NULL),

    -- Coletas IN_PROGRESS
    (5, 'IN_PROGRESS', 'VIDRO,PAPEL', false, NULL, '2024-09-12 08:00:00', NULL, 2, 2, 3),
    (4, 'IN_PROGRESS', 'PLASTICO,METAL', false, NULL, '2024-09-18 12:00:00', NULL, 3, 2, NULL),

    -- Coletas COMPLETED (avaliadas)
    (3, 'COMPLETED', 'VIDRO,PLASTICO', true, 5, '2024-09-12 09:00:00', '2024-09-12 11:00:00', 2, 2, 3),
    (6, 'COMPLETED', 'PAPEL,ELETRONICO', true, 4, '2024-09-17 10:00:00', '2024-09-17 11:45:00', 2, 2, 3),
    (8, 'COMPLETED', 'METAL,PAPEL', true, 3, '2024-09-19 14:00:00', '2024-09-19 17:30:00', 4, 2, 3),
    (3, 'COMPLETED', 'PAPEL,VIDRO', true, 5, '2024-09-23 20:00:00', '2024-09-23 21:45:00', 4, 2, 3),

    -- Coletas COMPLETED (não avaliadas)
    (7, 'COMPLETED', 'ELETRONICO,VIDRO', false, NULL, '2024-09-29 08:00:00', '2024-09-29 11:00:00', 2, 2, 3),
    (6, 'COMPLETED', 'PAPEL,PLASTICO', false, NULL, '2024-10-01 11:00:00', '2024-10-01 13:45:00', 4, 2, 3),

    -- Coletas CANCELLED
    (6, 'CANCELLED', 'PLASTICO,METAL', false, NULL, '2024-09-24 18:00:00', NULL, 1, 2, 3),
    (8, 'CANCELLED', 'VIDRO,PLASTICO', false, NULL, '2024-09-30 08:00:00', NULL, 3, 2, NULL),

    -- Coletas PAUSED
    (7, 'PAUSED', 'ELETRONICO,PAPEL', false, NULL, '2024-09-22 08:00:00', NULL, 3, 2, NULL),
    (5, 'PAUSED', 'METAL,PLASTICO', false, NULL, '2024-09-28 06:00:00', NULL, 1, 2, 3);

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