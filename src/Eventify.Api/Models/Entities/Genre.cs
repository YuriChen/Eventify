// Models/Entities/Genre.cs
namespace Eventify.API.Models.Entities;

public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // "House", "Techno", "K-Pop"
}