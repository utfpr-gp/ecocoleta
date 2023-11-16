CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    role VARCHAR(255) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
    );

INSERT INTO users (name, last_name, email, password, phone, role)
VALUES ('alvaro', 'pires', 'admin@admin.com', '$2a$10$1bkADWDLCqxTcELyR9KZ9.pKl4XftNQyfOH4a2mq2sqJ3dW/LersO', '42999660090', 'ADMIN');
