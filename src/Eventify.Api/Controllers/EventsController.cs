using Microsoft.AspNetCore.Mvc;
using System.Data;
using Dapper;

namespace Eventify.Api.Controllers;

public record EventListItem (
    int Id,
    string Title,
    string CoverImageUrl,
    string ProducerName,
    string VenueName,
    string City,
    string State,
    DateTime StartDate,
    DateTime? EndDate,
    decimal Price,
    bool IsSoldOut,
    List<string> Genres
);


[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IDbConnection _connection;

    public EventsController(IDbConnection connection)
    {
        _connection = connection;
    }

    [HttpGet]
    public async Task<ActionResult> GetEvents(
        int? cityId,
        [FromQuery] List<int>? genresIds,
        DateTime? startDate,
        DateTime? endDate)
    {
        // Current behaviour: no validation of the date range. An endDate before startDate
        // is sent to SQL as-is and returns 200 with an empty list. Could be revisited later.
        var sql = @"
            SELECT 
                e.Id, e.Title, e.CoverImageUrl,
                p.Name AS ProducerName,
                v.Name AS VenueName,
                c.Name AS City,
                c.State,
                e.StartDate, e.EndDate, e.Price, e.IsSoldOut,
                (
                    SELECT STRING_AGG(g.Name, ',')
                    FROM TbEventGenre eg
                    INNER JOIN TbGenre g ON eg.GenreId = g.Id
                    WHERE eg.EventId = e.Id
                ) AS Genres
            FROM TbEvent e
            INNER JOIN TbVenue v ON e.VenueId = v.Id
            INNER JOIN TbCity c ON v.CityId = c.Id
            INNER JOIN TbProducer p ON e.ProducerId = p.Id
            WHERE e.IsActive = 1
              AND (@CityId IS NULL OR v.CityId = @CityId)
              AND (@StartDate IS NULL OR e.StartDate >= @StartDate)
              AND (@EndDate IS NULL OR e.StartDate <= @EndDate)";

        if (genresIds?.Count > 0)
        {
            sql += @"
              AND EXISTS (
                  SELECT 1 FROM TbEventGenre eg
                  WHERE eg.EventId = e.Id AND eg.GenreId IN @GenresIds
              )";
        }

        sql += " ORDER BY e.StartDate";

        var events = await _connection.QueryAsync(sql, new
        {
            CityId = cityId,
            StartDate = startDate,
            EndDate = endDate,
            GenresIds = genresIds
        });

        var eventsFormated = events.Select(r =>
        {
            var genresCsv = (string?)r.Genres;
            var genres = string.IsNullOrWhiteSpace(genresCsv)
                ? new List<string>()
                : genresCsv.Split(',').ToList();

            return new EventListItem(
                (int)r.Id,
                (string)r.Title,
                (string)r.CoverImageUrl,
                (string)r.ProducerName,
                (string)r.VenueName,
                (string)r.City,
                (string)r.State,
                (DateTime)r.StartDate,
                (DateTime?)r.EndDate,
                (decimal)r.Price,
                (bool)r.IsSoldOut,
                genres   // ← lista
            );
        }).ToList();

        return Ok(eventsFormated);
    }
}