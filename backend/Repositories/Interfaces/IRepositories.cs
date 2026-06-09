using StellarApi.Models;

namespace StellarApi.Repositories.Interfaces;

// A camada Repository isola TODO o acesso ao banco. Quem usa só conhece a interface
// (o "contrato"), não a implementação. Isso facilita trocar/ testar depois.

public interface ITravelRepository
{
    Task<List<Travel>> GetAllAsync(string? search);
    Task<Travel?> GetByIdAsync(Guid id);
    Task<Travel> AddAsync(Travel travel);
    Task UpdateAsync(Travel travel);
    Task DeleteAsync(Travel travel);
    Task<bool> CompanyExistsAsync(Guid companyId);
    Task<bool> DestinationExistsAsync(Guid destinationId);
}

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<User> AddAsync(User user);
    Task<bool> EmailExistsAsync(string email);
}

public interface ITicketRepository
{
    Task<Ticket> AddAsync(Ticket ticket);
    Task<List<Ticket>> GetByUserAsync(Guid userId);
    Task<int> CountConfirmedByTravelAsync(Guid travelId);
}
