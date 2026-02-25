FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["Globals/Globals.csproj", "Globals/"]
COPY ["booking/RentObjectApiService/RentObjectApiService.csproj", "booking/RentObjectApiService/"]
RUN dotnet restore "booking/RentObjectApiService/RentObjectApiService.csproj"
COPY . .
WORKDIR "/src/booking/RentObjectApiService"
RUN dotnet build "RentObjectApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "RentObjectApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RentObjectApiService.dll"]
