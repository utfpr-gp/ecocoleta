-- Tabela principal para todos os usuários
CREATE TABLE IF NOT EXISTS users
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name        VARCHAR(255)                 NOT NULL,
    email       VARCHAR(255)                 NOT NULL,
    password    VARCHAR(255)                 NOT NULL,
    phone       VARCHAR(11)                  NOT NULL,
    role        VARCHAR(255)                 NOT NULL,
    activo      BOOLEAN                      NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
);

-- Table ecocoleta_db.address
CREATE TABLE IF NOT EXISTS address
(
    id           BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    city         VARCHAR(255),
    street       VARCHAR(255),
    number       VARCHAR(255),
    neighborhood VARCHAR(255),
    cep          VARCHAR(255),
    create_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP
);

-- Tabela para detalhes de residentes
CREATE TABLE IF NOT EXISTS residents
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    user_id     BIGSERIAL UNIQUE             NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Table ecocoleta_db.residents_address
CREATE TABLE IF NOT EXISTS residents_address
(
    address_id   BIGSERIAL NOT NULL,
    residents_id BIGSERIAL NOT NULL,
    PRIMARY KEY (residents_id, address_id),
    FOREIGN KEY (residents_id) REFERENCES residents (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table ecocoleta_db.waste_collectors
CREATE TABLE IF NOT EXISTS waste_collectors
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    user_id     BIGSERIAL UNIQUE,
    cpf         VARCHAR(11),
    score       INT,
    picture     VARCHAR(255),
    address_id  BIGSERIAL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    CONSTRAINT uc_waste_collectors_user_id UNIQUE (user_id), -- Adicionando uma restrição única
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


-- Table ecocoleta_db.companys
CREATE TABLE IF NOT EXISTS companys
(
    id           BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    user_id      BIGSERIAL UNIQUE,
    cnpj         VARCHAR(11)                  NOT NULL,
    company_name VARCHAR(255)                 NOT NULL,
    address_id   BIGSERIAL,
    create_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


-- Table ecocoleta_db.collects
CREATE TABLE IF NOT EXISTS collects
(
    id                  BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    is_intern           SMALLINT,
    schedule            TIMESTAMP                    NOT NULL,
    picture             VARCHAR(255),
    amount              VARCHAR(45)                  NOT NULL,
    create_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time         TIMESTAMP,
    address_id          BIGSERIAL,
    residents_id        BIGSERIAL,
    waste_collectors_id BIGSERIAL,
    CONSTRAINT fk_collects_address1
        FOREIGN KEY (address_id)
            REFERENCES address (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_collects_residents1
        FOREIGN KEY (residents_id)
            REFERENCES residents (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_collects_waste_collectors1
        FOREIGN KEY (waste_collectors_id)
            REFERENCES waste_collectors (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT unique_collects
        UNIQUE (id, address_id, residents_id, waste_collectors_id)
);


-- Table ecocoleta_db.evaluations
CREATE TABLE IF NOT EXISTS evaluations
(
    id                  BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    comments            VARCHAR(255)                 NOT NULL,
    stars               INT                          NOT NULL,
    id_user_destiny     BIGSERIAL                    NOT NULL,
    create_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waste_collectors_id BIGSERIAL                    NOT NULL,
    residents_id        BIGINT                       NOT NULL,
    CONSTRAINT fk_evaluations_waste_collectors
        FOREIGN KEY (waste_collectors_id)
            REFERENCES waste_collectors (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_evaluations_residents
        FOREIGN KEY (residents_id)
            REFERENCES residents (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);


-- Table ecocoleta_db.materials
CREATE TABLE IF NOT EXISTS materials
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name        VARCHAR(255)                 NOT NULL,
    score       BIGSERIAL                    NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
);

-- Table ecocoleta_db.products
CREATE TABLE IF NOT EXISTS products
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name        VARCHAR(255)                 NOT NULL,
    description VARCHAR(255)                 NOT NULL,
    price       DECIMAL                      NOT NULL,
    points      BIGINT                       NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    picture     VARCHAR(255),
    companys_id BIGSERIAL                    NOT NULL,
    FOREIGN KEY (companys_id)
        REFERENCES companys (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);


-- Table ecocoleta_db.exchanges
CREATE TABLE IF NOT EXISTS exchanges
(
    id          BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
);

-- Table ecocoleta_db.collects_has_materials
CREATE TABLE IF NOT EXISTS collects_has_materials
(
    collects_id  BIGSERIAL NOT NULL,
    materials_id BIGSERIAL NOT NULL,
    FOREIGN KEY (collects_id)
        REFERENCES collects (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (materials_id)
        REFERENCES materials (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- Table ecocoleta_db.products_has_exchanges
CREATE TABLE IF NOT EXISTS products_has_exchanges
(
    products_id  BIGSERIAL NOT NULL,
    exchanges_id BIGSERIAL NOT NULL,
    FOREIGN KEY (products_id)
        REFERENCES products (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (exchanges_id)
        REFERENCES exchanges (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
