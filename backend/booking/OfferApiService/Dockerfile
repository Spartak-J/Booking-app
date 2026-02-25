FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["Globals/Globals.csproj", "Globals/"]
COPY ["booking/OfferApiService/OfferApiService.csproj", "booking/OfferApiService/"]
RUN dotnet restore "booking/OfferApiService/OfferApiService.csproj"
COPY . .
WORKDIR "/src/booking/OfferApiService"
RUN dotnet build "OfferApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "OfferApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OfferApiService.dll"]
