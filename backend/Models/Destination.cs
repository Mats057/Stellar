namespace StellarApi.Models;

// Local extraterrestre disponível para viagem. Espelha a tabela "destination".
public class Destination
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Distância da Terra em km (FLOAT no banco -> double em C#).
    public double DistanceEarth { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Viagens que têm este destino.
    public ICollection<Travel> Travels { get; set; } = new List<Travel>();
}
