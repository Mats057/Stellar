namespace StellarApi.Models;

// Empresa parceira operadora das frotas. Espelha a tabela "company".
public class Company
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Viagens operadas por esta empresa.
    public ICollection<Travel> Travels { get; set; } = new List<Travel>();
}
