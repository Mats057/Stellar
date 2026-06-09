using System.ComponentModel.DataAnnotations;

namespace StellarApi.DTOs;

// Entrada da compra. O preço NÃO vem do cliente (segurança): o servidor usa o
// preço atual da viagem, evitando que alguém "compre por R$ 1".
public record BuyTicketRequestDto(
    [Required] Guid UserId,
    [Required] Guid TravelId
);

// Resposta de um ticket. Inclui a viagem aninhada (com company/destination)
// para a tela "Meus Tickets" do front.
public record TicketResponseDto(
    Guid Id,
    Guid UserId,
    Guid TravelId,
    decimal PricePaid,
    string Status,
    DateTime CreatedAt,
    TravelResponseDto? Travel
);
