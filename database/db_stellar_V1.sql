-- Criação do banco de dados para o MVP Stellar

-- Tabela: User
-- Armazena os dados dos passageiros/usuários da plataforma
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Destination
-- Locais extraterrestres disponíveis para viagem
CREATE TABLE destination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    distance_earth FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Company
-- Empresas parceiras operadoras das frotas espaciais
CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Travel
-- Instâncias de voos agendados associando uma empresa a um destino
CREATE TABLE travel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    company_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    description TEXT,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL, -- Corrigido para NOT NULL para garantir a integridade temporal do voo
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Chaves Estrangeiras (Foreign Keys)
    CONSTRAINT fk_travel_company FOREIGN KEY (company_id) 
        REFERENCES company(id) ON DELETE RESTRICT,
    CONSTRAINT fk_travel_destination FOREIGN KEY (destination_id) 
        REFERENCES destination(id) ON DELETE RESTRICT
);

-- Tabela: Ticket
-- Registro de compras. Congela o valor pago e vincula o usuário à viagem
CREATE TABLE ticket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    travel_id UUID NOT NULL,
    price_paid DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Chaves Estrangeiras (Foreign Keys)
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_travel FOREIGN KEY (travel_id) 
        REFERENCES travel(id) ON DELETE RESTRICT
);