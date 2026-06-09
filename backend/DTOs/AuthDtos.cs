using System.ComponentModel.DataAnnotations;

namespace StellarApi.DTOs;

// DTO = Data Transfer Object. É o "formato de troca" entre a API e o cliente.
// Separar DTO da entity protege o banco (ex.: nunca devolvemos o hash da senha).

// O que chega no cadastro. As [DataAnnotations] validam a entrada automaticamente.
public record RegisterRequestDto(
    [Required(ErrorMessage = "O nome é obrigatório.")]
    string Name,

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    string Email,

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "A senha deve ter ao menos 6 caracteres.")]
    string Password
);

// O que chega no login.
public record LoginRequestDto(
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    string Email,

    [Required(ErrorMessage = "A senha é obrigatória.")]
    string Password
);

// O que a API devolve sobre um usuário (note: SEM a senha).
public record UserResponseDto(Guid Id, string Name, string Email);
