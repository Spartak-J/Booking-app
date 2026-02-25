FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["booking/Globals/Globals.csproj", "booking/Globals/"]
COPY ["booking/AttractionApiService/AttractionApiService.csproj", "booking/AttractionApiService/"]
RUN dotnet restore "booking/AttractionApiService/AttractionApiService.csproj"
COPY . .
WORKDIR "/src/booking/AttractionApiService"
RUN dotnet build "AttractionApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "AttractionApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AttractionApiService.dll"]
