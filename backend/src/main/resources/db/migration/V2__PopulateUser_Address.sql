ALTER TABLE waste_collectors ALTER COLUMN address_id DROP NOT NULL;

ALTER TABLE companys ALTER COLUMN address_id DROP NOT NULL;

INSERT INTO users (name, email, password, phone, role, activo)
VALUES ('alvaro', 'admin@admin.com', '$2a$10$zNBVSnByhydlUd5m1sTS7erEbEtTrE9xiVtjSukJPHzXj1SStGgzK', '42999660090', 'ADMIN', true);

-- INSERT INTO address (city, street, number, neighborhood, cep)
-- VALUES ('Guarapuava', 'XV de Novembro', '123', 'Centro', '85065100');
