using StellarApi.DTOs;
using StellarApi.Exceptions;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;
using StellarApi.Services.Interfaces;

namespace StellarApi.Services;

public class AuthService(IUserRepository users) : IAuthService
{
    public async Task<UserResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        if (await users.EmailExistsAsync(dto.Email))
            throw new ConflictException("E-mail já cadastrado.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            // SEGURANÇA: guardamos só o HASH BCrypt, nunca a senha em texto puro.
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        await users.AddAsync(user);
        return DtoMapper.ToDto(user);
    }

    public async Task<UserResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var user = await users.GetByEmailAsync(dto.Email);
        if (user is null) return null;

        // Verify compara a senha digitada com o hash salvo (sem nunca "descriptografar").
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password)) return null;

        return DtoMapper.ToDto(user);
    }
}
