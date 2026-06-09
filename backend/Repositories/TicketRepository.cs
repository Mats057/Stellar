using Microsoft.EntityFrameworkCore;
using StellarApi.Data;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;

namespace StellarApi.Repositories;

public class TicketRepository(StellarContext context) : ITicketRepository
{
    public async Task<Ticket> AddAsync(Ticket ticket)
    {
        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();
        return ticket;
    }

    // Tickets do usuário, já com a viagem + empresa + destino aninhados.
    public Task<List<Ticket>> GetByUserAsync(Guid userId) =>
        context.Tickets
            .Where(t => t.UserId == userId)
            .Include(t => t.Travel).ThenInclude(tr => tr.Company)
            .Include(t => t.Travel).ThenInclude(tr => tr.Destination)
            .Include(t => t.Travel).ThenInclude(tr => tr.Tickets)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

    // Quantos tickets CONFIRMED esta viagem já tem (= tickets_sold). Usado na regra de capacidade.
    public Task<int> CountConfirmedByTravelAsync(Guid travelId) =>
        context.Tickets.CountAsync(t => t.TravelId == travelId && t.Status == "CONFIRMED");
}
