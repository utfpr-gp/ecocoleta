CREATE EXTENSION IF NOT EXISTS postgis;

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
    check_phone BOOLEAN   DEFAULT false,
    check_email BOOLEAN   DEFAULT false,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
);

-- Table ecocoleta_db.address
CREATE TABLE IF NOT EXISTS address
(
    id           BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    name         VARCHAR(255),
    city         VARCHAR(255),
    street       VARCHAR(255),
    number       VARCHAR(255),
    neighborhood VARCHAR(255),
    cep          VARCHAR(255),
    state        VARCHAR(255),
    latitude     DOUBLE PRECISION,
    longitude    DOUBLE PRECISION,
    location     GEOGRAPHY(POINT, 4326), -- Coluna para armazenar a localização
    create_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP
);

-- Uso de Índices Espaciais: Para consultas eficientes baseadas em localização
CREATE INDEX idx_location ON address USING GIST (location);

-- Tabela para detalhes de residentes
CREATE TABLE IF NOT EXISTS residents
(
    id          BIGINT PRIMARY KEY,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Table ecocoleta_db.user_address
CREATE TABLE IF NOT EXISTS user_addresses
(
    user_id    BIGINT NOT NULL,
    address_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, address_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Table ecocoleta_db.waste_collectors
CREATE TABLE IF NOT EXISTS waste_collectors
(
    id               BIGINT PRIMARY KEY,
    cpf              VARCHAR(11),
    score            INTEGER   DEFAULT null,
    picture          VARCHAR(255),
    location         GEOGRAPHY(POINT, 4326), -- Coluna para armazenar a localização
    location_updated TIMESTAMP,
    create_time      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time      TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Criar índice espacial para localização (eficiência nas consultas)
CREATE INDEX idx_waste_collectors_location ON waste_collectors USING GIST (location);

-- Table ecocoleta_db.companys
CREATE TABLE IF NOT EXISTS companys
(
    id           BIGINT PRIMARY KEY,
    cnpj         VARCHAR(11)  NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    create_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Table ecocoleta_db.collects
CREATE TABLE IF NOT EXISTS collects
(
    id                 BIGSERIAL PRIMARY KEY UNIQUE NOT NULL,
    amount             INTEGER,
    is_evaluated       BOOLEAN   DEFAULT false,
    rating             INTEGER,
    status             VARCHAR(255)                 NOT NULL,
    materials          VARCHAR(255),
    init_time          TIMESTAMP,
    end_time           TIMESTAMP,
    create_time        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time        TIMESTAMP,
    address_id         BIGSERIAL,
    resident_id        BIGSERIAL,
    waste_collector_id BIGSERIAL,
    CONSTRAINT fk_collects_address1
        FOREIGN KEY (address_id)
            REFERENCES address (id)
            ON DELETE SET NULL
            ON UPDATE NO ACTION,
    CONSTRAINT fk_collects_resident1
        FOREIGN KEY (resident_id)
            REFERENCES residents (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
    CONSTRAINT fk_collects_waste_collector1
        FOREIGN KEY (waste_collector_id)
            REFERENCES waste_collectors (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
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
    score       BIGINT                       NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP
);

-- Table ecocoleta_db.collects_materials
CREATE TABLE IF NOT EXISTS collects_materials
(
    collect_id  BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    PRIMARY KEY (collect_id, material_id),
    FOREIGN KEY (collect_id) REFERENCES collects (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (material_id) REFERENCES materials (id) ON DELETE NO ACTION ON UPDATE NO ACTION
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

-- Table ecocoleta_db.products_has_exchanges
CREATE TABLE IF NOT EXISTS products_has_exchanges
(
    products_id  BIGINT NOT NULL,
    exchanges_id BIGINT NOT NULL,
    FOREIGN KEY (products_id)
        REFERENCES products (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (exchanges_id)
        REFERENCES exchanges (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- Alter to acept null
ALTER TABLE collects
    ALTER COLUMN waste_collector_id DROP NOT NULL;
ALTER TABLE collects
    ALTER COLUMN address_id DROP NOT NULL;
