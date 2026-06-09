using StellarApi.DTOs;
using StellarApi.Exceptions;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;
using StellarApi.Services.Interfaces;

namespace StellarApi.Services;

public class TicketService(
    ITicketRepository tickets,
    ITravelRepository travels,
    IUserRepository users) : ITicketService
{
    public async Task<TicketResponseDto> BuyAsync(BuyTicketRequestDto dto)
    {
        var user = await users.GetByIdAsync(dto.UserId)
            ?? throw new NotFoundException("Usuário não encontrado.");
        var travel = await travels.GetByIdAsync(dto.TravelId)
            ?? throw new NotFoundException("Viagem não encontrada.");

        // Regra de negócio: não vender além da capacidade.
        var sold = await tickets.CountConfirmedByTravelAsync(travel.Id);
        if (sold >= travel.Capacity)
            throw new BusinessException("Viagem esgotada (sold out).");

        var ticket = new Ticket
        {
            UserId = user.Id,
            TravelId = travel.Id,
            PricePaid = travel.Price, // preço do servidor (não confia no cliente)
            Status = "CONFIRMED"
        };
        await tickets.AddAsync(ticket);

        ticket.Travel = travel; // anexa a viagem para devolver aninhada
        return DtoMapper.ToDto(ticket);
    }

    public async Task<List<TicketResponseDto>> GetUserTicketsAsync(Guid userId) =>
        (await tickets.GetByUserAsync(userId)).Select(DtoMapper.ToDto).ToList();
}
