# CLAUDE.md — Eventify

## What it is

Eventify is a full-stack platform for discovering music events
(festivals, concerts, parties, club nights). It lets users explore events
by city, date, and music genre.


### Backend — `src/Eventify.Api/`

REST API built with .NET 10 + ASP.NET Core.

- `Controllers/` → HTTP endpoints (`EventsController`, `GenresController`)
- `Models/Entities/` → domain entities (`Event`, `Venue`, `City`, `Producer`, `Genre`)
- `Data/` → `AppDbContext`
- `Program.cs` → application configuration

**Data access:**
- **EF Core** only for `Genre`.
- **Dapper** for complex queries, like in Events.

**Database:** SQL Server, with tables prefixed by `Tb` (e.g., `TbEvent`, `TbVenue`).



### Frontend — `src/Eventify.Web/`

Angular 22 application with Tailwind CSS and ZardUI.

- `src/pages/` → routed pages (e.g., `event-list`)
- `src/components/` → reusable components (e.g., `cardgrid`, `header`)
- `src/classes/` → TypeScript interfaces (`Evento`, `Genero`)
- `src/services/` → API communication (`ApiService`)
- `src/app/` → app shell (`App`, routes, config) and ZardUI code under `src/app/shared/` (imported via the `@/` alias)

Unit tests use Vitest (`@angular/build:unit-test`, jsdom) and live next to the
file they test (`*.spec.ts`).


## Commands

```bash
# Backend
cd src/Eventify.Api
dotnet run

# Backend tests (xUnit) — from the repo root
dotnet test Eventify.slnx

# Frontend
cd src/Eventify.Web
ng serve

# Frontend tests (Vitest)
ng test --watch=false
```