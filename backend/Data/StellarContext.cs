using Microsoft.EntityFrameworkCore;
using StellarApi.Models;

namespace StellarApi.Data;

// O DbContext é a "ponte" entre as classes C# e o banco de dados.
// Cada DbSet vira uma tabela; o EF Core traduz LINQ <-> SQL por baixo dos panos.
public class StellarContext : DbContext
{
    public StellarContext(DbContextOptions<StellarContext> options) : base(options)
    {
    }

    // IDs e data fixos para os dados-semente. Precisam ser CONSTANTES: se mudassem a
    // cada execução, o EF acharia que o modelo mudou e pediria uma nova migration.
    private static readonly Guid MarteId = Guid.Parse("d0000000-0000-0000-0000-000000000001");
    private static readonly Guid TitaId = Guid.Parse("d0000000-0000-0000-0000-000000000002");
    private static readonly Guid EuropaId = Guid.Parse("d0000000-0000-0000-0000-000000000003");
    private static readonly Guid LunarId = Guid.Parse("d0000000-0000-0000-0000-000000000004");

    private static readonly Guid SpaceXId = Guid.Parse("c0000000-0000-0000-0000-000000000001");
    private static readonly Guid BlueOriginId = Guid.Parse("c0000000-0000-0000-0000-000000000002");
    private static readonly Guid VirginId = Guid.Parse("c0000000-0000-0000-0000-000000000003");

    private static readonly Guid TravelMarteId = Guid.Parse("70000000-0000-0000-0000-000000000001");
    private static readonly Guid TravelLunarId = Guid.Parse("70000000-0000-0000-0000-000000000002");
    private static readonly Guid TravelTitaId = Guid.Parse("70000000-0000-0000-0000-000000000003");

    private static readonly DateTime SeedDate = new(2026, 1, 1, 0, 0, 0);

    public DbSet<User> Users => Set<User>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Travel> Travels => Set<Travel>();
    public DbSet<Ticket> Tickets => Set<Ticket>();

    // Aqui afinamos como cada entidade vira tabela: nomes, defaults, relações.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("user");
            e.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(u => u.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            // E-mail único: o banco rejeita cadastro duplicado.
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Destination>(e =>
        {
            e.ToTable("destination");
            e.Property(d => d.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(d => d.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(d => d.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Company>(e =>
        {
            e.ToTable("company");
            e.Property(c => c.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Travel>(e =>
        {
            e.ToTable("travel");
            e.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(t => t.Price).HasPrecision(10, 2);
            e.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // travel.company_id -> company.id (RESTRICT: não deixa apagar empresa com viagem).
            e.HasOne(t => t.Company)
                .WithMany(c => c.Travels)
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            // travel.destination_id -> destination.id (RESTRICT).
            e.HasOne(t => t.Destination)
                .WithMany(d => d.Travels)
                .HasForeignKey(t => t.DestinationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Ticket>(e =>
        {
            e.ToTable("ticket");
            e.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(t => t.PricePaid).HasPrecision(10, 2);
            e.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // ticket.user_id -> user.id (CASCADE: apagar usuário apaga seus tickets).
            e.HasOne(t => t.User)
                .WithMany(u => u.Tickets)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ticket.travel_id -> travel.id (RESTRICT).
            e.HasOne(t => t.Travel)
                .WithMany(tr => tr.Tickets)
                .HasForeignKey(t => t.TravelId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        SeedData(modelBuilder);
    }

    // Dados iniciais (mesmos do mockData.js do front). HasData insere via migration.
    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Destination>().HasData(
            new Destination { Id = MarteId, Name = "Marte (Nova Colônia Texas)", Description = "Experimente as dunas vermelhas e o majestoso Olympus Mons.", DistanceEarth = 225_000_000, CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Destination { Id = TitaId, Name = "Titã (Lua de Saturno)", Description = "Explore lagos de metano e céus laranjas em nossas cidades-domo de luxo.", DistanceEarth = 1_200_000_000, CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Destination { Id = EuropaId, Name = "Europa (Lua de Júpiter)", Description = "Oceanos subglaciais e vistas deslumbrantes de Júpiter.", DistanceEarth = 628_300_000, CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Destination { Id = LunarId, Name = "Estação Lunar Alpha", Description = "Uma escapada rápida! Desfrute de recreação em baixa gravidade no vizinho mais próximo da Terra.", DistanceEarth = 384_400, CreatedAt = SeedDate, UpdatedAt = SeedDate }
        );

        modelBuilder.Entity<Company>().HasData(
            new Company { Id = SpaceXId, Name = "SpaceX Interplanetária", Description = "Os pioneiros das viagens espaciais modernas.", CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Company { Id = BlueOriginId, Name = "Fronteiras Blue Origin", Description = "Conforto e luxo para o viajante espacial exigente.", CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Company { Id = VirginId, Name = "Virgin Galactic Espaço Profundo", Description = "Estilo e experiência.", CreatedAt = SeedDate, UpdatedAt = SeedDate }
        );

        modelBuilder.Entity<Travel>().HasData(
            new Travel { Id = TravelMarteId, Name = "Expresso Marte Rota A", Price = 250000m, Capacity = 50, CompanyId = SpaceXId, DestinationId = MarteId, Description = "Voo direto para Marte utilizando a recém-reformada Starship.", DepartureTime = new DateTime(2026, 8, 15, 8, 0, 0), ArrivalTime = new DateTime(2026, 11, 20, 14, 0, 0), CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Travel { Id = TravelLunarId, Name = "Especial de Fim de Semana Lunar", Price = 15000m, Capacity = 200, CompanyId = VirginId, DestinationId = LunarId, Description = "Passe o fim de semana na Lua. Rápido, fácil e acessível.", DepartureTime = new DateTime(2026, 6, 10, 10, 0, 0), ArrivalTime = new DateTime(2026, 6, 13, 10, 0, 0), CreatedAt = SeedDate, UpdatedAt = SeedDate },
            new Travel { Id = TravelTitaId, Name = "Explorador de Titã", Price = 850000m, Capacity = 20, CompanyId = BlueOriginId, DestinationId = TitaId, Description = "Um longo cruzeiro de luxo para os serenos lagos de Titã.", DepartureTime = new DateTime(2027, 1, 5, 0, 0, 0), ArrivalTime = new DateTime(2029, 5, 15, 12, 0, 0), CreatedAt = SeedDate, UpdatedAt = SeedDate }
        );
    }
}
