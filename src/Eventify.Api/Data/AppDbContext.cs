using Microsoft.EntityFrameworkCore;
using Eventify.API.Models.Entities;

namespace Eventify.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<Event> Events => Set<Event>();
}