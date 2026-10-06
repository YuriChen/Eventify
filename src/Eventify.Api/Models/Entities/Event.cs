// Models/Entities/Genre.cs
namespace Eventify.API.Models.Entities;

public class Event
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty; // "House", "Techno", "K-Pop"
}