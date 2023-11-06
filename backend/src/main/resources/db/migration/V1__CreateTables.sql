CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    role VARCHAR(255) NOT NULL,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO users (name, last_name, email, password, phone, role)
VALUES ('alvaro', 'pires', 'admin@admin.com', 'senha', '42999660090', 'ADMIN');
