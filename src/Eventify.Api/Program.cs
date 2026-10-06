using Eventify.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<System.Data.IDbConnection>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new Microsoft.Data.SqlClient.SqlConnection(
        config.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection(); // Opcional, mas comum
//app.UseAuthorization();    // Opcional, se usar autenticação
app.MapControllers(); // Habilita o mapeamento das rotas dos Controllers

app.Run();