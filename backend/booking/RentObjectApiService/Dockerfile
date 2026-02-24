FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Globals/Globals.csproj", "Globals/"]
COPY ["booking/RentObjectApiService/RentObjectApiService.csproj", "booking/RentObjectApiService/"]

RUN dotnet restore "booking/RentObjectApiService/RentObjectApiService.csproj"

COPY Globals/ ./Globals/
COPY booking/RentObjectApiService/ ./booking/RentObjectApiService/

WORKDIR "/src/booking/RentObjectApiService"
RUN dotnet build "RentObjectApiService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "RentObjectApiService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RentObjectApiService.dll"]
