using System.Data;
using Dapper;
using Eventify.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Dapper;

namespace Eventify.API.Tests.Controllers;

public class EventsControllerTests
{
    private static readonly DateTime Start = new(2026, 12, 31, 22, 0, 0);

    private readonly Mock<IDbConnection> _connection = new();

    // Moq.Dapper builds its DataReader from the properties of T, so rows use a concrete type
    // with the same columns as the SELECT in EventsController.
    public sealed record EventRow(
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
        string? Genres);

    private static EventRow Row(
        int id = 1,
        string title = "Festival",
        string? genres = "House,Techno",
        DateTime? endDate = null) =>
        new(id, title, "https://img/cover.png", "Producer", "Venue", "Sao Paulo", "SP",
            Start, endDate, 99.9m, false, genres);

    private EventsController CreateController(params EventRow[] rows)
    {
        _connection
            .SetupDapperAsync(c => c.QueryAsync<EventRow>(It.IsAny<string>(), It.IsAny<object>(), null, null, null))
            .ReturnsAsync(rows.ToList());
        return new EventsController(_connection.Object);
    }

    // Moq.Dapper hands out the same command for every CreateCommand() call,
    // so after the controller runs it holds the SQL Dapper executed.
    private string ExecutedSql() => _connection.Object.CreateCommand().CommandText;

    private static List<EventListItem> Items(ActionResult result)
    {
        var ok = Assert.IsType<OkObjectResult>(result);
        return Assert.IsType<List<EventListItem>>(ok.Value);
    }

    [Fact]
    public async Task GetEvents_Should_ReturnOkWithEmptyList_When_NoRowsMatch()
    {
        var controller = CreateController();

        var result = await controller.GetEvents(null, null, null, null);

        Assert.Empty(Items(result));
    }

    [Fact]
    public async Task GetEvents_Should_MapRowToEventListItem_When_RowIsReturned()
    {
        var controller = CreateController(Row(id: 7, title: "Rave", endDate: Start.AddHours(8)));

        var item = Assert.Single(Items(await controller.GetEvents(null, null, null, null)));

        Assert.Equal(7, item.Id);
        Assert.Equal("Rave", item.Title);
        Assert.Equal("https://img/cover.png", item.CoverImageUrl);
        Assert.Equal("Producer", item.ProducerName);
        Assert.Equal("Venue", item.VenueName);
        Assert.Equal("Sao Paulo", item.City);
        Assert.Equal("SP", item.State);
        Assert.Equal(Start, item.StartDate);
        Assert.Equal(Start.AddHours(8), item.EndDate);
        Assert.Equal(99.9m, item.Price);
        Assert.False(item.IsSoldOut);
    }

    [Fact]
    public async Task GetEvents_Should_ReturnNullEndDate_When_EventHasNoEndDate()
    {
        var controller = CreateController(Row(endDate: null));

        var item = Assert.Single(Items(await controller.GetEvents(null, null, null, null)));

        Assert.Null(item.EndDate);
    }

    [Fact]
    public async Task GetEvents_Should_SplitGenresIntoList_When_GenresCsvHasMultipleValues()
    {
        var controller = CreateController(Row(genres: "House,Techno,K-Pop"));

        var item = Assert.Single(Items(await controller.GetEvents(null, null, null, null)));

        Assert.Equal(["House", "Techno", "K-Pop"], item.Genres);
    }

    [Fact]
    public async Task GetEvents_Should_ReturnSingleGenre_When_GenresCsvHasOneValue()
    {
        var controller = CreateController(Row(genres: "Rock"));

        var item = Assert.Single(Items(await controller.GetEvents(null, null, null, null)));

        Assert.Equal(["Rock"], item.Genres);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GetEvents_Should_ReturnEmptyGenres_When_GenresColumnIsNullOrBlank(string? genres)
    {
        var controller = CreateController(Row(genres: genres));

        var item = Assert.Single(Items(await controller.GetEvents(null, null, null, null)));

        Assert.NotNull(item.Genres);
        Assert.Empty(item.Genres);
    }

    [Fact]
    public async Task GetEvents_Should_KeepRowOrder_When_MultipleRowsAreReturned()
    {
        var controller = CreateController(Row(id: 3), Row(id: 1), Row(id: 2));

        var items = Items(await controller.GetEvents(null, null, null, null));

        Assert.Equal([3, 1, 2], items.Select(i => i.Id));
    }

    [Fact]
    public async Task GetEvents_Should_NotAddGenreClause_When_GenresIdsIsNull()
    {
        var controller = CreateController();

        await controller.GetEvents(null, null, null, null);

        Assert.DoesNotContain("@GenresIds", ExecutedSql());
    }

    [Fact]
    public async Task GetEvents_Should_NotAddGenreClause_When_GenresIdsIsEmpty()
    {
        var controller = CreateController();

        await controller.GetEvents(null, [], null, null);

        Assert.DoesNotContain("@GenresIds", ExecutedSql());
    }

    [Theory]
    [InlineData(1)]
    [InlineData(1, 2, 3)]
    public async Task GetEvents_Should_AddGenreClause_When_GenresIdsAreProvided(params int[] genresIds)
    {
        var controller = CreateController();

        await controller.GetEvents(null, genresIds.ToList(), null, null);

        // Dapper expands "IN @GenresIds" into "IN (@GenresIds1, ...)" before execution.
        Assert.Contains("eg.GenreId IN", ExecutedSql());
    }

    [Fact]
    public async Task GetEvents_Should_FilterByCityAndDates_When_AllFiltersAreProvided()
    {
        var controller = CreateController();

        await controller.GetEvents(1, [2], Start, Start.AddDays(1));

        var sql = ExecutedSql();
        Assert.Contains("v.CityId = @CityId", sql);
        Assert.Contains("e.StartDate >= @StartDate", sql);
        Assert.Contains("e.StartDate <= @EndDate", sql);
    }

    [Fact]
    public async Task GetEvents_Should_OnlyQueryActiveEventsOrderedByStartDate_When_NoFilterIsProvided()
    {
        var controller = CreateController();

        await controller.GetEvents(null, null, null, null);

        var sql = ExecutedSql();
        Assert.Contains("e.IsActive = 1", sql);
        Assert.EndsWith("ORDER BY e.StartDate", sql);
    }

    [Fact]
    public async Task GetEvents_Should_ReturnOk_When_EndDateIsBeforeStartDate()
    {
        // The controller does no validation: an inverted range is sent to SQL and yields no rows.
        var controller = CreateController();

        var result = await controller.GetEvents(null, null, Start, Start.AddDays(-5));

        Assert.Empty(Items(result));
    }

    [Fact]
    public async Task GetEvents_Should_ReturnEmptyList_When_CityIdMatchesNothing()
    {
        var controller = CreateController();

        var result = await controller.GetEvents(-1, null, null, null);

        Assert.Empty(Items(result));
    }

    [Fact]
    public async Task GetEvents_Should_PropagateException_When_QueryFails()
    {
        // Moq.Dapper ignores Throws(), so the failure is raised where Dapper starts: CreateCommand().
        _connection.Setup(c => c.CreateCommand()).Throws(new InvalidOperationException("db down"));
        var controller = new EventsController(_connection.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => controller.GetEvents(null, null, null, null));
    }
}
