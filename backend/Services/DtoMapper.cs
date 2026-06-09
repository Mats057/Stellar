using StellarApi.DTOs;
using StellarApi.Models;

namespace StellarApi.Services;

// Converte as entidades do banco para os DTOs que a API devolve.
// Centralizar aqui evita repetir o mapeamento em vários lugares.
public static class DtoMapper
{
    public static TravelResponseDto ToDto(Travel t) => new(
        t.Id,
        t.Name,
        t.Price,
        t.Capacity,
        t.CompanyId,
        t.DestinationId,
        t.Description,
        t.DepartureTime,
        t.ArrivalTime,
        // tickets_sold = quantos tickets CONFIRMED esta viagem tem.
        t.Tickets?.Count(x => x.Status == "CONFIRMED") ?? 0,
        t.Company is null ? null : new CompanyResponseDto(t.Company.Id, t.Company.Name, t.Company.Description),
        t.Destination is null ? null : new DestinationResponseDto(t.Destination.Id, t.Destination.Name, t.Destination.Description, t.Destination.DistanceEarth)
    );

    public static TicketResponseDto ToDto(Ticket t) => new(
        t.Id,
        t.UserId,
        t.TravelId,
        t.PricePaid,
        t.Status,
        t.CreatedAt,
        t.Travel is null ? null : ToDto(t.Travel)
    );

    public static UserResponseDto ToDto(User u) => new(u.Id, u.Name, u.Email);
}
