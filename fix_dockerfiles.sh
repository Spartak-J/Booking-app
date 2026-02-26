#!/bin/bash

BACKEND="/d/Projects/Booking-app/Booking-app/backend/booking"

SERVICES=(
    "AttractionApiService"
    "LocationApiService"
    "OfferApiService"
    "OrderApiService"
    "RentObjectApiService"
    "ReviewApiService"
    "StatisticApiService"
    "TranslationApiService"
    "UserApiService"
)

for SERVICE in "${SERVICES[@]}"; do
    DOCKERFILE="$BACKEND/$SERVICE/Dockerfile"
    CSPROJ="$SERVICE/$SERVICE.csproj"
    DLL="$SERVICE.dll"

    cat > "$DOCKERFILE" << EOF
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["booking/booking.sln", "booking/"]
COPY ["Globals/Globals.csproj", "Globals/"]
COPY ["booking/$CSPROJ", "booking/$SERVICE/"]
RUN dotnet restore "booking/$CSPROJ"
COPY . .
WORKDIR "/src/booking/$SERVICE"
RUN dotnet build "$SERVICE.csproj" -c \$BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "$SERVICE.csproj" -c \$BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "$DLL"]
EOF

    echo "✅ Fixed: $SERVICE"
done

echo "Done! All Dockerfiles updated."
