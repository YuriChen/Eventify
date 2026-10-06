using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Eventify.API.Data;
using Eventify.API.Models.Entities;

namespace Eventify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private readonly AppDbContext _context;

    public GenresController (AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> GetGenres()
    {
        return Ok(await _context.Genres.OrderBy(g => g.Name).ToListAsync());
    }
}