using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using StellarApi.Data;
using StellarApi.Exceptions;
using StellarApi.Repositories;
using StellarApi.Repositories.Interfaces;
using StellarApi.Services;
using StellarApi.Services.Interfaces;

// Npgsql: trata DateTime como "timestamp without time zone" (mais simples p/ iniciante).
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ===== FASE 1: registrar serviços (o que a API "tem") =====

// Controllers + JSON em snake_case (company_id, tickets_sold...), batendo com o front.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseLower;
    });

// Banco de dados: PostgreSQL via EF Core, com colunas em snake_case.
var connectionString = builder.Configuration.GetConnectionString("StellarConnection");
builder.Services.AddDbContext<StellarContext>(options =>
    options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

// Injeção de dependência das nossas camadas. "Scoped" = uma instância por requisição.
// Registramos pela INTERFACE: quem pede ITravelService recebe um TravelService pronto.
builder.Services.AddScoped<ITravelRepository, TravelRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<ITravelService, TravelService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();

// Tratador central de erros de negócio (transforma AppException em status HTTP).
builder.Services.AddExceptionHandler<AppExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS: permite o front (Vite/localhost) chamar a API. Pronto p/ integração futura.
const string FrontCors = "FrontCors";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontCors, policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// Documentação OpenAPI (consumida pelo Scalar).
builder.Services.AddOpenApi();

var app = builder.Build();

// ===== FASE 2: pipeline (por onde cada requisição passa) =====

// Primeiro de tudo: captura exceções e devolve JSON de erro.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // UI de documentação em /scalar/v1
}

// Força HTTPS apenas fora de desenvolvimento (em dev usamos http p/ facilitar testes e o front).
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors(FrontCors);
app.UseAuthorization();
app.MapControllers();

app.Run();
