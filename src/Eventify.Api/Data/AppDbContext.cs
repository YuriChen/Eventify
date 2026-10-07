using Microsoft.EntityFrameworkCore;
using Eventify.Api.Models.Entities;

namespace Eventify.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<Event> Events => Set<Event>();
}