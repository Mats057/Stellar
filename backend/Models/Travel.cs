namespace StellarApi.Models;

// Um voo agendado, ligando uma empresa a um destino. Espelha a tabela "travel".
public class Travel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Preço em DECIMAL(10,2) -> decimal em C# (preciso para dinheiro).
    public decimal Price { get; set; }
    public int Capacity { get; set; }

    // Chaves estrangeiras (os IDs que ligam a outras tabelas).
    public Guid CompanyId { get; set; }
    public Guid DestinationId { get; set; }

    public string? Description { get; set; }
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Propriedades de navegação: os objetos completos do outro lado da FK.
    public Company Company { get; set; } = null!;
    public Destination Destination { get; set; } = null!;

    // Tickets vendidos para esta viagem (usado para calcular tickets_sold).
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
