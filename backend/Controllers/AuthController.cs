using Microsoft.AspNetCore.Mvc;
using StellarApi.DTOs;
using StellarApi.Services.Interfaces;

namespace StellarApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService service) : ControllerBase
{
    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto) =>
        Ok(await service.RegisterAsync(dto));

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var user = await service.LoginAsync(dto);
        return user is null
            ? Unauthorized(new { message = "Credenciais inválidas." })
            : Ok(user);
    }
}
