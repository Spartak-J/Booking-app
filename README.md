# 🏨 Booking Oselya

**Booking Oselya** — комплексная платформа бронирования отелей и жилья, разработанная как дипломный проект.

[![Production](https://img.shields.io/badge/production-live-success)](https://booking-oselya.pp.ua)
[![Backend](https://img.shields.io/badge/backend-C%23%20.NET%208-purple)](backend/)
[![Frontend](https://img.shields.io/badge/frontend-React-blue)](frontend/)
[![Mobile](https://img.shields.io/badge/mobile-React%20Native-cyan)](mobile-app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🌐 Production

**https://booking-oselya.pp.ua**

---

## 🏗️ Architecture

Система построена на микросервисной архитектуре с 9 независимыми C# .NET API сервисами:

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare                            │
│              (DNS + SSL + WAF + DDoS)                    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                 Nginx API Gateway                         │
│              (Reverse Proxy + Security Headers)           │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
 User   Offer  Order  Loc-  Attr-  Rent  Review Stat  Trans
  API    API    API   ation  action  Obj   API   API   API
   │      │      │      │      │      │      │      │    │
   └──────┴──────┴──────┴──────┴──────┴──────┴──────┴────┘
                        │
              ┌─────────▼──────────┐
              │    RabbitMQ         │
              │  (Message Broker)   │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │    PostgreSQL 15    │
              │   (9 databases)     │
              └────────────────────┘
```

---

## 🚀 Microservices

| Service | Technology | Database | Description |
|---------|-----------|----------|-------------|
| **User API** | C# .NET 8 | booking_db | Auth, users, JWT |
| **Offer API** | C# .NET 8 | booking_db | Hotel offers |
| **Order API** | C# .NET 8 | booking_db | Bookings & orders |
| **Location API** | C# .NET 8 | booking_locations | Cities, regions |
| **Attraction API** | C# .NET 8 | booking_attractions | Tourist spots |
| **RentObject API** | C# .NET 8 | booking_rentobjects | Properties |
| **Review API** | C# .NET 8 | booking_reviews | Ratings & reviews |
| **Statistic API** | C# .NET 8 | booking_statistics | Analytics |
| **Translation API** | C# .NET 8 | booking_translations | i18n (UA/EN/RU) |
| **WebApiGateway** | C# .NET 8 | — | API aggregation |
| **Frontend** | React 18 | — | Web application |
| **Mobile** | React Native | — | iOS & Android app |

---

## 🛠️ Technology Stack

### Backend
- **Language:** C# .NET 8
- **Database:** PostgreSQL 15
- **Message Broker:** RabbitMQ 3.12
- **ORM:** Entity Framework Core
- **API Docs:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **i18n:** Multi-language (UA/EN/RU)

### Mobile
- **Framework:** React Native (Expo)
- **Platforms:** iOS & Android

### DevOps & Infrastructure
- **Cloud:** AWS EC2 (Ubuntu 24.04)
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Registry:** DockerHub
- **DNS/CDN:** Cloudflare
- **Web Server:** Nginx
- **Monitoring:** Prometheus + Grafana
- **Security:** Fail2Ban, OWASP ZAP, Trivy

---

## 📁 Repository Structure

```
Booking-app/
├── backend/
│   └── booking/
│       ├── Globals/                    # Shared library (EF, RabbitMQ)
│       ├── UserApiService/             # User & auth API
│       ├── OfferApiService/            # Offers API
│       ├── OrderApiService/            # Orders API
│       ├── LocationApiService/         # Location API
│       ├── AttractionApiService/       # Attractions API
│       ├── RentObjectApiService/       # RentObject API
│       ├── ReviewApiService/           # Reviews API
│       ├── StatisticApiService/        # Statistics API
│       ├── TranslationApiService/      # Translation API
│       └── WebApiGetway/               # API Gateway
├── frontend/                           # React web app
├── mobile-app/                         # React Native app
├── docs/                               # Documentation
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml             # Frontend CI/CD
│       └── backend-ci.yml              # Backend CI/CD (all 10 services)
└── README.md
```

---

## 🔄 CI/CD

### Automatic deployment on push:

**Backend:** Push to `main` with changes in `backend/` → Build 10 Docker images in parallel → Push to DockerHub → Deploy to EC2

**Frontend:** Push with changes in `frontend/` → Security scan → Build Docker image → Deploy to EC2

### DockerHub images:
```
spartakj/booking-user-api:latest
spartakj/booking-offer-api:latest
spartakj/booking-order-api:latest
spartakj/booking-location-api:latest
spartakj/booking-attraction-api:latest
spartakj/booking-rentobject-api:latest
spartakj/booking-review-api:latest
spartakj/booking-statistic-api:latest
spartakj/booking-translation-api:latest
spartakj/booking-webapi-gateway:latest
spartakj/booking-frontend:latest
```

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Artem** | DevOps Engineer | AWS, Docker, CI/CD, Security, Monitoring, Nginx |
| **Yuliia** | Backend Developer | C# .NET APIs, PostgreSQL, RabbitMQ, Entity Framework |
| **Inna** | Frontend Developer | React web app, React Native mobile app |

---

## 🔗 Links

- **Production:** https://booking-oselya.pp.ua
- **Infrastructure Repository:** https://github.com/Spartak-J/Booking-infrastructure
- **DockerHub:** https://hub.docker.com/u/spartakj
