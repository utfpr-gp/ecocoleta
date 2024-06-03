INSERT INTO users (id, name, email, password, phone, role, activo) VALUES
                                                                   (1, 'alvaro', 'admin@admin.com', '$2a$10$zNBVSnByhydlUd5m1sTS7erEbEtTrE9xiVtjSukJPHzXj1SStGgzK', '42999660090', 'ADMIN', true), -- passaword: admin--
                                                                   (2, 'Separador Teste', 'resident1@teste.com', '$2a$10$i3bOy2CnlO6Mmk63710I0O3.BTTiGDke7ptEXL0Dm.bQgeGr2Dhuy', '42999660090', 'RESIDENT', true), -- passaword: 12345--
                                                                   (3, 'Catador  Teste', 'catador1@teste.com', '$2a$10$.J9iJ8m/tFZ2onVabsUY4.TDfSCVVDt4zA8vrUCsrbXL1C9yX1Yha', '42999660090', 'WASTE_COLLECTOR', true), -- passaword: 12345--
                                                                   (4, 'Empresa Teste', 'empresa1@teste.com', '$2a$10$MRK0pecpBNU3FEKTu2q4FO8ep.hml2eaTUjUXoG0QicJapS32f8vu', '42999660090', 'COMPANY', true); -- passaword: 12345--

INSERT INTO residents (id, user_id) VALUES
                                        (1, 2);

INSERT INTO waste_collectors (id, user_id, cpf) VALUES
                                        (1, 3, '12345678901');

INSERT INTO companys (id, user_id, cnpj, company_name) VALUES
                                        (1, 4, '12345678901', 'Empresa Teste');

INSERT INTO address (id, name, city, street, number, neighborhood, cep, latitude, longitude) VALUES
                                                                        (1, 'Casa', 'Guarapuava', 'Rua Emiliano Perneta', 303, 'Alto da XV', 85065070, '-25.3813', '-51.45775'),
                                                                        (2, 'Empresa', 'Guarapuava', 'Rua Souza Naves', 77, 'Alto da XV', 85065080, '-25.3800', '-51.4573'),
                                                                        (3, 'Casa', 'Guarapuava', 'Rua Guaíra', 1379, 'Centro', 85015280, '-25.3808', '-51.4558'),
                                                                        (4, 'Empresa', 'Guarapuava', 'Rua Benjamin Constant', 862, 'Centro', 85010190, '-25.3888', '-51.4628');

INSERT INTO user_addresses (user_id, address_id) VALUES
                                                (2, 1),
                                                (2, 2),
                                                (3, 3),
                                                (4, 4);

INSERT INTO materials (name, score) VALUES
                                        ('Papel e Papelão - Jornais e revistas', 10),
                                        ('Papel e Papelão - Folhetos e panfletos', 10),
                                        ('Papel e Papelão - Caixas de papelão', 10),
                                        ('Papel e Papelão - Papel sulfite e papel de escritório', 10),
                                        ('Papel e Papelão - Embalagens de papel', 10),
                                        ('Plásticos - Garrafas PET (como as de refrigerante)', 10),
                                        ('Plásticos - Sacos plásticos', 10),
                                        ('Plásticos - Embalagens plásticas (de alimentos, produtos de limpeza, etc.)', 10),
                                        ('Plásticos - Tampas plásticas', 10),
                                        ('Plásticos - Tubos e canos plásticos', 10),
                                        ('Vidros - Garrafas de vidro (de bebidas, azeite, etc.)', 10),
                                        ('Vidros - Potes de vidro (de alimentos, cosméticos, etc.)', 10),
                                        ('Vidros - Vidros de janelas', 10),
                                        ('Vidros - Frascos de medicamentos (não contaminados)', 10),
                                        ('Metais - Latas de alumínio (de refrigerantes, cervejas, etc.)', 10),
                                        ('Metais - Latas de aço (de alimentos enlatados)', 10),
                                        ('Metais - Ferragens e pregos', 10),
                                        ('Metais - Alumínio (folhas, embalagens de alimentos, etc.)', 10),
                                        ('Metais - Cabos e fios metálicos', 10),
                                        ('Tetrapak - Caixas de leite', 10),
                                        ('Tetrapak - Embalagens de sucos', 10),
                                        ('Tetrapak - Embalagens de molhos e outros líquidos', 10),
                                        ('Eletrônicos - Aparelhos eletrônicos antigos (celulares, computadores, televisores, etc.)', 10),
                                        ('Eletrônicos - Pilhas e baterias (em locais específicos de coleta)', 10),
                                        ('Eletrônicos - Cabos e componentes eletrônicos', 10),
                                        ('Madeira - Paletes', 10),
                                        ('Madeira - Móveis antigos', 10),
                                        ('Madeira - Serragem e restos de madeira (em alguns programas de reciclagem específicos)', 10),
                                        ('Tecidos e Têxteis - Roupas usadas', 10),
                                        ('Tecidos e Têxteis - Tecidos de algodão, lã, poliéster, etc.', 10),
                                        ('Tecidos e Têxteis - Panos e retalhos', 10);