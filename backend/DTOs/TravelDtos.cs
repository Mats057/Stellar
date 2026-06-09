using System.ComponentModel.DataAnnotations;

namespace StellarApi.DTOs;

// Objetos "achatados" da empresa e do destino, aninhados na resposta da viagem
// (o front espera travel.company e travel.destination).
public record CompanyResponseDto(Guid Id, string Name, string? Description);

public record DestinationResponseDto(Guid Id, string Name, string? Description, double DistanceEarth);

// Resposta de uma viagem. Inclui tickets_sold (calculado) + company + destination aninhados.
public record TravelResponseDto(
    Guid Id,
    string Name,
    decimal Price,
    int Capacity,
    Guid CompanyId,
    Guid DestinationId,
    string? Description,
    DateTime DepartureTime,
    DateTime ArrivalTime,
    int TicketsSold,
    CompanyResponseDto? Company,
    DestinationResponseDto? Destination
);

// Entrada para criar uma viagem (POST).
public record TravelCreateDto(
    [Required(ErrorMessage = "O nome é obrigatório.")]
    string Name,

    [Range(0, double.MaxValue, ErrorMessage = "Preço inválido.")]
    decimal Price,

    [Range(1, int.MaxValue, ErrorMessage = "A capacidade deve ser >= 1.")]
    int Capacity,

    [Required] Guid CompanyId,
    [Required] Guid DestinationId,
    string? Description,
    DateTime DepartureTime,
    DateTime ArrivalTime
);

// Entrada para atualizar uma viagem (PUT). Tudo opcional = atualização parcial:
// só os campos enviados são alterados.
public record TravelUpdateDto(
    string? Name,
    decimal? Price,
    int? Capacity,
    Guid? CompanyId,
    Guid? DestinationId,
    string? Description,
    DateTime? DepartureTime,
    DateTime? ArrivalTime
);
