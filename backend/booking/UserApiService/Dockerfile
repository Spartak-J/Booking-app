FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["Globals/Globals.csproj", "Globals/"]
COPY ["booking/UserApiService/UserApiService.csproj", "booking/UserApiService/"]
RUN dotnet restore "booking/UserApiService/UserApiService.csproj"
COPY . .
WORKDIR "/src/booking/UserApiService"
RUN dotnet build "UserApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "UserApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserApiService.dll"]
