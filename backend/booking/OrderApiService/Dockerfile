FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["booking/Globals/Globals.csproj", "booking/Globals/"]
COPY ["booking/OrderApiService/OrderApiService.csproj", "booking/OrderApiService/"]
RUN dotnet restore "booking/OrderApiService/OrderApiService.csproj"
COPY . .
WORKDIR "/src/booking/OrderApiService"
RUN dotnet build "OrderApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "OrderApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrderApiService.dll"]
