# Chicksum Backend (NestJS + PostgreSQL + Redis)

Modern high-performance backend microservice for the **Chicksum** fresh meat delivery storefront.

---

## 🏗 Architecture Overview

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/) managed with [Prisma ORM](https://www.prisma.io/)
- **Cache & Fast Session Layer**: [Redis 7](https://redis.io/) via `ioredis` with TTL caching & graceful fallback
- **API Documentation**: Auto-generated OpenAPI / Swagger UI at `/api/docs`
- **Validation**: `class-validator` and `class-transformer`

```
┌─────────────────────────┐          ┌──────────────────────────┐
│ Next.js Storefront      │◄────────►│ NestJS Backend           │
│ (Port 3000)             │   REST   │ (Port 4000)              │
└─────────────────────────┘          └────────────┬─────────────┘
                                                  │
                                    ┌─────────────┴─────────────┐
                                    ▼                           ▼
                       ┌───────────────────────┐   ┌───────────────────────┐
                       │  PostgreSQL 16        │   │  Redis 7 Cache        │
                       │  (Prisma ORM, Pt 5432)│   │  (TTL 300s, Pt 6379)  │
                       └───────────────────────┘   └───────────────────────┘
```

---

## 🚀 Quick Start

### 1. Start PostgreSQL and Redis (Docker)
```bash
cd backend
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run start:dev
```
- API Base: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`
- Healthcheck: `http://localhost:4000/api/health`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Cache |
|---|---|---|---|
| `GET` | `/api/health` | Service, DB, and Redis health status | Direct |
| `GET` | `/api/products` | Filter by category, search term, featured | Redis (180s) |
| `GET` | `/api/products/categories` | List categories with product counts | Redis (600s) |
| `GET` | `/api/products/:id` | Single product detail | Redis (300s) |
| `POST` | `/api/orders` | Place fresh cut order | Invalidation |
| `GET` | `/api/orders/:orderNumber` | Track order by order number | Redis (3600s) |
