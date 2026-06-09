using Microsoft.AspNetCore.Mvc;
using StellarApi.DTOs;
using StellarApi.Services.Interfaces;

namespace StellarApi.Controllers;

[ApiController]
[Route("api/travels")]
public class TravelsController(ITravelService service) : ControllerBase
{
    // GET /api/travels?search=marte
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search) =>
        Ok(await service.GetAllAsync(search));

    // GET /api/travels/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var travel = await service.GetByIdAsync(id);
        return travel is null ? NotFound() : Ok(travel);
    }

    // POST /api/travels
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TravelCreateDto dto)
    {
        var created = await service.CreateAsync(dto);
        // 201 Created + cabeçalho Location apontando para o recurso novo.
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/travels/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] TravelUpdateDto dto)
    {
        var updated = await service.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /api/travels/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
