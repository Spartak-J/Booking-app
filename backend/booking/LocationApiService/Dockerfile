FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["booking/Globals/Globals.csproj", "booking/Globals/"]
COPY ["booking/LocationApiService/LocationApiService.csproj", "booking/LocationApiService/"]
RUN dotnet restore "booking/LocationApiService/LocationApiService.csproj"
COPY . .
WORKDIR "/src/booking/LocationApiService"
RUN dotnet build "LocationApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "LocationApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LocationApiService.dll"]
