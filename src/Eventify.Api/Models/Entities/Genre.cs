// Models/Entities/Genre.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace Eventify.Api.Models.Entities;

[Table("TbGenre")]
public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // "House", "Techno", "K-Pop"
}