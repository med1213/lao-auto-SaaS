# Lao Auto SaaS

Multi-tenant car dealership SaaS platform for Laos. Dealers can manage inventory and leads; customers can browse, compare, contact, and book test drives.

## Stack

- Angular standalone frontend with TailwindCSS
- NestJS REST API with TypeORM and PostgreSQL
- JWT auth, RBAC, tenant data isolation
- Socket.IO notifications
- Docker Compose for local development

## Quick Start

The default local database connection matches pgAdmin-style settings:

- Host: `localhost`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: `admin`

```bash
cp .env.example .env
npm run install:all
npm run start:api
npm run start:web
```

Frontend: http://localhost:4200  
Backend: http://localhost:3000/api

For Docker, Compose starts its own Postgres container with the same user, password, and database. The API container uses the internal `postgres` hostname automatically:

```bash
docker compose up --build
```

## Local Development

```bash
npm install
npm run start:api
npm run start:web
```

## Production Build

```bash
npm run build
docker compose -f docker-compose.yml up --build -d
```

## Tenant Model

Every dealer is a tenant. Tenant-owned rows include `tenant_id`, and API requests from dealer roles are scoped through the authenticated user's tenant. Public routes can query all active/published cars or filter by dealer slug.
