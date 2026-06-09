using Microsoft.AspNetCore.Mvc;
using StellarApi.Services.Interfaces;

namespace StellarApi.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(ITicketService ticketService) : ControllerBase
{
    // GET /api/users/{userId}/tickets -> histórico de compras do usuário
    [HttpGet("{userId:guid}/tickets")]
    public async Task<IActionResult> GetUserTickets(Guid userId) =>
        Ok(await ticketService.GetUserTicketsAsync(userId));
}
