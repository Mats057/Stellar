# Stellar API — Back-end (C# / ASP.NET Core + EF Core)

API RESTful do MVP **Stellar** (marketplace de passagens espaciais). Faz a ponte entre o
front-end e o banco PostgreSQL, com arquitetura em 3 camadas e autenticação com senha
criptografada.

> Projeto acadêmico — Global Solution 2026/1 (Engenharia de Software).

## Tecnologias

- **.NET 10** / ASP.NET Core Web API (Controllers)
- **Entity Framework Core 10** + **Npgsql** (PostgreSQL)
- **PostgreSQL 18**
- **BCrypt.Net-Next** (hash de senha)
- **Scalar** (documentação OpenAPI)

## Arquitetura em 3 camadas

```
Controller  ->  Service  ->  Repository  ->  DbContext (EF Core)  ->  PostgreSQL
 (HTTP)        (regras)     (acesso dados)
```

- **Controllers/** — recebem a requisição HTTP e devolvem a resposta.
- **Services/** — regras de negócio (capacidade, cálculo de `tickets_sold`, hash de senha).
- **Repositories/** — todo o acesso ao banco (consultas EF Core).
- **Models/** — entidades que espelham as tabelas.
- **DTOs/** — objetos de entrada/saída (separados das entidades).
- **Data/StellarContext.cs** — o DbContext (mapeamento + seed).

## Pré-requisitos

1. **.NET SDK 10** — verifique com `dotnet --version`.
2. **PostgreSQL 18** rodando localmente.
3. Ferramenta EF: `dotnet tool install --global dotnet-ef`.

## Configuração

1. **Crie o banco** (uma vez):
   ```sql
   CREATE DATABASE stellar;
   ```

2. **Connection string** em `appsettings.json` (ajuste a senha do seu PostgreSQL):
   ```json
   "ConnectionStrings": {
     "StellarConnection": "Host=localhost;Port=5432;Database=stellar;Username=postgres;Password=stellar123"
   }
   ```

3. **Crie as tabelas + dados-semente** aplicando as migrations:
   ```bash
   dotnet ef database update
   ```

## Como executar

```bash
dotnet run --launch-profile http
```

A API sobe em **http://localhost:5009**.

- **Documentação interativa (Scalar):** http://localhost:5009/scalar/v1
- **OpenAPI (JSON):** http://localhost:5009/openapi/v1.json

Para testar os endpoints, abra `StellarApi.http` no VS Code (extensão *REST Client*)
e clique em **Send Request** em cada bloco.

## Endpoints

| Verbo  | Rota                              | Descrição                              |
|--------|-----------------------------------|----------------------------------------|
| GET    | `/api/travels`                    | Lista viagens (`?search=` opcional)    |
| GET    | `/api/travels/{id}`               | Detalhe de uma viagem                  |
| POST   | `/api/travels`                    | Cria viagem                            |
| PUT    | `/api/travels/{id}`               | Atualiza viagem (parcial)              |
| DELETE | `/api/travels/{id}`               | Remove viagem                          |
| POST   | `/api/auth/register`              | Cadastra usuário (senha com BCrypt)    |
| POST   | `/api/auth/login`                 | Autentica usuário                      |
| POST   | `/api/tickets`                    | Compra passagem (checa capacidade)     |
| GET    | `/api/users/{userId}/tickets`     | Histórico de compras do usuário        |

## Segurança

- **Senhas com hash BCrypt** — nunca armazenadas em texto puro.
- **Validação de entrada** via Data Annotations nos DTOs (`[Required]`, `[EmailAddress]`...).
- **Proteção contra SQL Injection** — o EF Core usa sempre consultas parametrizadas.
- **Preço da compra definido no servidor** — o cliente não consegue forjar o valor pago.

## Banco de dados

As migrations (`Migrations/`) geram exatamente o esquema do `database/db_stellar_V1.sql`
(tabelas `user`, `destination`, `company`, `travel`, `ticket` em snake_case, PKs `uuid`).
Para recriar do zero: `dotnet ef database drop` seguido de `dotnet ef database update`.
