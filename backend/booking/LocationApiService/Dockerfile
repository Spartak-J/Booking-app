FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy Globals (dependency)
COPY ["Globals/Globals.csproj", "Globals/"]

# Copy LocationApiService
COPY ["booking/LocationApiService/LocationApiService.csproj", "booking/LocationApiService/"]

# Restore
RUN dotnet restore "booking/LocationApiService/LocationApiService.csproj"

# Copy source
COPY Globals/ ./Globals/
COPY booking/LocationApiService/ ./booking/LocationApiService/

# Build
WORKDIR "/src/booking/LocationApiService"
RUN dotnet build "LocationApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "LocationApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LocationApiService.dll"]
