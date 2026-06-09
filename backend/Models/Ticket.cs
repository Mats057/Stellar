namespace StellarApi.Models;

// Registro de uma compra. Congela o preço pago e liga usuário <-> viagem.
// Espelha a tabela "ticket".
public class Ticket
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public Guid TravelId { get; set; }

    // Preço congelado no momento da compra (pode diferir do preço atual da viagem).
    public decimal PricePaid { get; set; }

    // Estado do ticket: "CONFIRMED", "CANCELLED", etc.
    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Propriedades de navegação.
    public User User { get; set; } = null!;
    public Travel Travel { get; set; } = null!;
}
