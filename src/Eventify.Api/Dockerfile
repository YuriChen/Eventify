# ETAPA 1: Construção (Build)
# Usa uma imagem que já tem o .NET SDK instalado
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia o arquivo de projeto (.csproj) para restaurar as dependências
COPY ["Eventify.Api.csproj", "./"]
RUN dotnet restore "Eventify.Api.csproj"

# Copia o resto do código e compila
COPY . .
RUN dotnet publish "Eventify.Api.csproj" -c Release -o /app/publish

# ETAPA 2: Execução (Runtime)
# Usa uma imagem menor, apenas com o necessário para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Cria um usuário não-root por segurança (boa prática)
USER app

# Copia apenas os arquivos compilados da ETAPA 1
COPY --from=build /app/publish .

# Informa a porta que o contêiner vai usar
EXPOSE 8080

# Comando que será executado quando o contêiner iniciar
ENTRYPOINT ["dotnet", "Eventify.Api.dll"]