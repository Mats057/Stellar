# Plano de Testes — Stellar API

**Projeto:** Stellar — marketplace de passagens espaciais (Global Solution 2026/1)
**Componente testado:** Backend / API RESTful (C# · ASP.NET Core · EF Core · PostgreSQL)

## 1. Objetivo

Validar o comportamento dos serviços da API, cobrindo **todos os 9 endpoints** (os 4 verbos
HTTP — GET, POST, PUT, DELETE) e os caminhos de **sucesso**, **erro/negativo**, **validação de
entrada** e **regra de negócio**. Garante confiabilidade da camada de back-end antes da entrega.

## 2. Ambiente de teste

| Item | Valor |
|---|---|
| API | ASP.NET Core (.NET 10), `http://localhost:5009` |
| Banco | PostgreSQL 18 (banco `stellar`, com dados-semente) |
| Ferramenta de execução | Script PowerShell `docs/run-tests.ps1` (via `Invoke-WebRequest`) |
| Evidência gerada | `docs/relatorio-testes.html` (requisição + resposta reais de cada caso) |
| Tipo de teste | Automatizado, caixa-preta (via HTTP) |

## 3. Casos de teste

| ID | Área | Cenário | Entrada | Saída esperada | Status esperado |
|----|------|---------|---------|----------------|:---------------:|
| CT-01 | Viagens | Listar todas as viagens | (nenhuma) | Lista de viagens com `company`, `destination` e `tickets_sold` | 200 |
| CT-02 | Viagens | Buscar viagens por texto | `?search=marte` | Apenas viagens que casam com "marte" | 200 |
| CT-03 | Viagens | Detalhar viagem existente | `id` válido | Dados completos da viagem | 200 |
| CT-04 | Viagens | Detalhar viagem inexistente | `id` inexistente | Tratamento de "não encontrado" | 404 |
| CT-05 | Viagens | Criar nova viagem (POST) | JSON válido (name, price, capacity, FKs, datas) | Viagem criada com `id` gerado | 201 |
| CT-06 | Viagens | Rejeitar viagem inválida | JSON sem `name` e `capacity=0` | Erros de validação; nada gravado | 400 |
| CT-07 | Viagens | Atualizar viagem (PUT) | `{ price: 88000 }` | Viagem atualizada (preço alterado) | 200 |
| CT-08 | Viagens | Excluir viagem (DELETE) | `id` da viagem de teste | Viagem removida | 204 |
| CT-09 | Segurança | Cadastrar usuário (senha com hash) | name, email, password | `{id, name, email}` **sem** a senha | 200 |
| CT-10 | Segurança | Bloquear e-mail duplicado | e-mail já cadastrado | Conflito; cadastro recusado | 409 |
| CT-11 | Segurança | Rejeitar senha curta | `password="123"` | Erro de validação na senha | 400 |
| CT-12 | Segurança | Login com credenciais corretas | email + senha corretos | Dados do usuário autenticado | 200 |
| CT-13 | Segurança | Bloquear login com senha errada | senha incorreta | Acesso negado | 401 |
| CT-14 | Tickets | Comprar passagem (regra de negócio) | user_id + travel_id | Ticket `CONFIRMED`, `price_paid` definido pelo servidor | 201 |
| CT-15 | Tickets | Histórico de tickets do usuário | `userId` | Lista de tickets com a viagem aninhada | 200 |

## 4. Resultado da execução

Execução automatizada de **todos os 15 casos**. Resultado: **15 de 15 PASSARAM** ✅

| ID | Status obtido | Resultado | | ID | Status obtido | Resultado |
|----|:---:|:---:|---|----|:---:|:---:|
| CT-01 | 200 | ✅ PASS | | CT-09 | 200 | ✅ PASS |
| CT-02 | 200 | ✅ PASS | | CT-10 | 409 | ✅ PASS |
| CT-03 | 200 | ✅ PASS | | CT-11 | 400 | ✅ PASS |
| CT-04 | 404 | ✅ PASS | | CT-12 | 200 | ✅ PASS |
| CT-05 | 201 | ✅ PASS | | CT-13 | 401 | ✅ PASS |
| CT-06 | 400 | ✅ PASS | | CT-14 | 201 | ✅ PASS |
| CT-07 | 200 | ✅ PASS | | CT-15 | 200 | ✅ PASS |
| CT-08 | 204 | ✅ PASS | | | | |

**Cobertura:** 9/9 endpoints · 4/4 verbos HTTP (GET, POST, PUT, DELETE) · práticas de segurança
exercitadas (hash de senha não exposto, validação de entrada, bloqueio de credenciais inválidas).

## 5. Como reproduzir

```powershell
# 1) Suba a API
dotnet run --project backend/StellarApi.csproj --launch-profile http

# 2) Em outro terminal, rode a suíte de testes
powershell -File docs/run-tests.ps1
```

O script imprime o resultado de cada caso no terminal (`CT-01|200|PASS`, ...) e **gera o relatório
de evidências** `docs/relatorio-testes.html` com a requisição e a resposta reais de cada teste.

## 6. Evidências

- **`docs/relatorio-testes.html`** — relatório visual com a evidência real de cada execução
  (abra no navegador e use *Imprimir → Salvar como PDF* para anexar à entrega).
- **Log do terminal** — saída do `run-tests.ps1` mostrando `15/15` casos aprovados.
