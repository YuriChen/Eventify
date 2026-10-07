using Eventify.Api.Controllers;
using Eventify.Api.Data;
using Eventify.Api.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eventify.Api.Tests.Controllers;

// AppDbContext is exercised through the EF Core InMemory provider rather than a Moq mock:
// the controller depends on DbSet LINQ + async materialization, which Moq cannot fake reliably.
public class GenresControllerTests : IDisposable
{
    private readonly AppDbContext _context = new(
        new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    public void Dispose() => _context.Dispose();

    private static List<Genre> Genres(ActionResult<List<Genre>> result)
    {
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        return Assert.IsType<List<Genre>>(ok.Value);
    }

    [Fact]
    public async Task GetGenres_Should_ReturnOkWithEmptyList_When_NoGenresExist()
    {
        var controller = new GenresController(_context);

        var result = await controller.GetGenres();

        Assert.Empty(Genres(result));
    }

    [Fact]
    public async Task GetGenres_Should_ReturnGenresOrderedByName_When_GenresExist()
    {
        _context.Genres.AddRange(
            new Genre { Name = "Techno" },
            new Genre { Name = "House" },
            new Genre { Name = "K-Pop" });
        await _context.SaveChangesAsync();
        var controller = new GenresController(_context);

        var genres = Genres(await controller.GetGenres());

        Assert.Equal(["House", "K-Pop", "Techno"], genres.Select(g => g.Name));
    }

    [Fact]
    public async Task GetGenres_Should_ReturnAllGenres_When_ManyGenresExist()
    {
        _context.Genres.AddRange(Enumerable.Range(1, 50).Select(i => new Genre { Name = $"Genre {i:00}" }));
        await _context.SaveChangesAsync();
        var controller = new GenresController(_context);

        var genres = Genres(await controller.GetGenres());

        Assert.Equal(50, genres.Count);
    }

    [Fact]
    public async Task GetGenres_Should_KeepDuplicateNames_When_GenresShareTheSameName()
    {
        _context.Genres.AddRange(new Genre { Name = "House" }, new Genre { Name = "House" });
        await _context.SaveChangesAsync();
        var controller = new GenresController(_context);

        var genres = Genres(await controller.GetGenres());

        Assert.Equal(2, genres.Count);
    }
}
