using Microsoft.EntityFrameworkCore;
using StellarApi.Data;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;

namespace StellarApi.Repositories;

// Recebe o StellarContext por injeção de dependência (sintaxe de "primary constructor").
public class TravelRepository(StellarContext context) : ITravelRepository
{
    public async Task<List<Travel>> GetAllAsync(string? search)
    {
        // .Include carrega os dados relacionados (empresa, destino, tickets) junto.
        var query = context.Travels
            .Include(t => t.Company)
            .Include(t => t.Destination)
            .Include(t => t.Tickets)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.ToLower();
            query = query.Where(t =>
                t.Name.ToLower().Contains(q) ||
                t.Company.Name.ToLower().Contains(q) ||
                t.Destination.Name.ToLower().Contains(q));
        }

        return await query.OrderBy(t => t.DepartureTime).ToListAsync();
    }

    public async Task<Travel?> GetByIdAsync(Guid id) =>
        await context.Travels
            .Include(t => t.Company)
            .Include(t => t.Destination)
            .Include(t => t.Tickets)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Travel> AddAsync(Travel travel)
    {
        context.Travels.Add(travel);
        await context.SaveChangesAsync(); // só aqui o INSERT realmente acontece
        return travel;
    }

    public async Task UpdateAsync(Travel travel)
    {
        context.Travels.Update(travel);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Travel travel)
    {
        context.Travels.Remove(travel);
        await context.SaveChangesAsync();
    }

    public Task<bool> CompanyExistsAsync(Guid companyId) =>
        context.Companies.AnyAsync(c => c.Id == companyId);

    public Task<bool> DestinationExistsAsync(Guid destinationId) =>
        context.Destinations.AnyAsync(d => d.Id == destinationId);
}
