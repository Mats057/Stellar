using StellarApi.DTOs;

namespace StellarApi.Services.Interfaces;

// A camada Service expõe as OPERAÇÕES de negócio. Os Controllers chamam só isto.
public interface ITravelService
{
    Task<List<TravelResponseDto>> GetAllAsync(string? search);
    Task<TravelResponseDto?> GetByIdAsync(Guid id);
    Task<TravelResponseDto> CreateAsync(TravelCreateDto dto);
    Task<TravelResponseDto?> UpdateAsync(Guid id, TravelUpdateDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public interface IAuthService
{
    Task<UserResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<UserResponseDto?> LoginAsync(LoginRequestDto dto);
}

public interface ITicketService
{
    Task<TicketResponseDto> BuyAsync(BuyTicketRequestDto dto);
    Task<List<TicketResponseDto>> GetUserTicketsAsync(Guid userId);
}
