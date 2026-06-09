using Microsoft.AspNetCore.Mvc;
using StellarApi.DTOs;
using StellarApi.Services.Interfaces;

namespace StellarApi.Controllers;

[ApiController]
[Route("api/tickets")]
public class TicketsController(ITicketService service) : ControllerBase
{
    // POST /api/tickets  -> compra uma passagem
    [HttpPost]
    public async Task<IActionResult> Buy([FromBody] BuyTicketRequestDto dto)
    {
        var ticket = await service.BuyAsync(dto);
        return Created($"/api/users/{ticket.UserId}/tickets", ticket);
    }
}
