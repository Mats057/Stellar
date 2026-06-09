using StellarApi.DTOs;
using StellarApi.Exceptions;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;
using StellarApi.Services.Interfaces;

namespace StellarApi.Services;

public class TravelService(ITravelRepository travels) : ITravelService
{
    public async Task<List<TravelResponseDto>> GetAllAsync(string? search) =>
        (await travels.GetAllAsync(search)).Select(DtoMapper.ToDto).ToList();

    public async Task<TravelResponseDto?> GetByIdAsync(Guid id)
    {
        var travel = await travels.GetByIdAsync(id);
        return travel is null ? null : DtoMapper.ToDto(travel);
    }

    public async Task<TravelResponseDto> CreateAsync(TravelCreateDto dto)
    {
        // Valida as chaves estrangeiras antes de inserir (erro amigável em vez de 500).
        if (!await travels.CompanyExistsAsync(dto.CompanyId))
            throw new BusinessException("Empresa (company_id) não encontrada.");
        if (!await travels.DestinationExistsAsync(dto.DestinationId))
            throw new BusinessException("Destino (destination_id) não encontrado.");

        var travel = new Travel
        {
            Name = dto.Name,
            Price = dto.Price,
            Capacity = dto.Capacity,
            CompanyId = dto.CompanyId,
            DestinationId = dto.DestinationId,
            Description = dto.Description,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime
        };
        await travels.AddAsync(travel);

        // Recarrega já com company/destination para a resposta sair completa.
        var created = await travels.GetByIdAsync(travel.Id);
        return DtoMapper.ToDto(created!);
    }

    public async Task<TravelResponseDto?> UpdateAsync(Guid id, TravelUpdateDto dto)
    {
        var travel = await travels.GetByIdAsync(id);
        if (travel is null) return null;

        // Atualização parcial: só mexe no que veio preenchido.
        if (!string.IsNullOrWhiteSpace(dto.Name)) travel.Name = dto.Name;
        if (dto.Price is > 0) travel.Price = dto.Price.Value;
        if (dto.Capacity is > 0) travel.Capacity = dto.Capacity.Value;
        if (dto.Description is not null) travel.Description = dto.Description;
        if (dto.DepartureTime is not null) travel.DepartureTime = dto.DepartureTime.Value;
        if (dto.ArrivalTime is not null) travel.ArrivalTime = dto.ArrivalTime.Value;

        if (dto.CompanyId is not null)
        {
            if (!await travels.CompanyExistsAsync(dto.CompanyId.Value))
                throw new BusinessException("Empresa (company_id) não encontrada.");
            travel.CompanyId = dto.CompanyId.Value;
        }
        if (dto.DestinationId is not null)
        {
            if (!await travels.DestinationExistsAsync(dto.DestinationId.Value))
                throw new BusinessException("Destino (destination_id) não encontrado.");
            travel.DestinationId = dto.DestinationId.Value;
        }

        travel.UpdatedAt = DateTime.Now;
        await travels.UpdateAsync(travel);

        var updated = await travels.GetByIdAsync(id);
        return DtoMapper.ToDto(updated!);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var travel = await travels.GetByIdAsync(id);
        if (travel is null) return false;

        // FK RESTRICT: não deixa apagar viagem que já tem tickets vendidos.
        if (travel.Tickets.Count > 0)
            throw new BusinessException("Não é possível excluir uma viagem que já possui tickets.");

        await travels.DeleteAsync(travel);
        return true;
    }
}
