namespace StellarApi.Models;

// Representa um passageiro/usuário da plataforma. Espelha a tabela "user".
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    // Armazena o HASH BCrypt da senha — nunca a senha em texto puro.
    public string Password { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Propriedade de navegação: os tickets comprados por este usuário.
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
