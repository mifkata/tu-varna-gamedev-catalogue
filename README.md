# TU Varna GameDev Catalogue

A catalogue of game development companies built with NestJS, Next.js, and PostgreSQL.

## Tech Stack

- **Backend**: NestJS with Fastify
- **Frontend**: Next.js 15 with React 19
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Package Manager**: pnpm

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for local database)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` as needed. Default values work for local development.

### 3. Start Database

Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- pgAdmin on port 5050 (http://localhost:5050)

### 4. Run Migrations

Apply database migrations:

```bash
pnpm migration:run
```

### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
pnpm seed
```

This seeds the database with realistic game catalogue data including:
- **10 Game Developers**: CD Projekt Red, Rockstar Games, Valve, FromSoftware, Bethesda, Nintendo, Blizzard, Ubisoft, EA, Naughty Dog
- **9 Categories**: RPG, Action-Adventure, Shooter, Souls-like, Open World, Puzzle, MOBA, Strategy, Sports
- **30 Games**: Including classics like Half-Life (1998) and modern titles like Elden Ring (2022)
- **Inventory Records**: With realistic pricing in EUR and stock levels

### 6. Start Development Server

```bash
pnpm start:dev
```

The application will be available at:
- Backend API: http://localhost:3000/api
- Frontend: http://localhost:3000

## Available Commands

### Development

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Start backend in watch mode with hot reload |
| `pnpm start:debug` | Start backend in debug mode with watch |
| `pnpm start` | Start backend (no watch mode) |

### Production

| Command | Description |
|---------|-------------|
| `pnpm build` | Build both backend and frontend for production |
| `pnpm build:backend` | Build only backend (TypeScript compilation) |
| `pnpm build:frontend` | Build only frontend (Next.js build) |
| `pnpm start:prod` | Start production server from `dist/` |

### Database Migrations

| Command | Description |
|---------|-------------|
| `pnpm migration:generate <name>` | Generate a new migration based on entity changes |
| `pnpm migration:run` | Run pending migrations |
| `pnpm migration:revert` | Revert the last migration |
| `pnpm seed` | Populate database with sample game catalogue data |

**Example:**
```bash
pnpm migration:generate migrations/AddUserTable
```

**Note on seeding:** The `pnpm seed` command will clear existing data and populate the database with 30 games from 10 major developers, along with categories and inventory records. Use this for development and testing purposes.

### Testing

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cover` | Run tests with coverage report |

### Code Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Run ESLint and Prettier checks |
| `pnpm lint:fix` | Auto-fix linting and formatting issues |
| `pnpm eslint:lint` | Run ESLint only |
| `pnpm eslint:fix` | Auto-fix ESLint issues |
| `pnpm prettier:lint` | Check code formatting |
| `pnpm prettier:fix` | Auto-format code |

## Project Structure

```
.
├── backend/
│   ├── entities/      # TypeORM database entities
│   ├── seeds/         # Database seed files
│   ├── controllers/   # API route controllers
│   └── ...
├── frontend/          # Next.js frontend application
├── config/            # Configuration files (see config/README.md)
├── migrations/        # TypeORM database migrations
├── dist/              # Compiled production files
├── .data/             # Docker volume for PostgreSQL data
└── docker-compose.yml # Docker services configuration
```

## Configuration

Configuration is managed using the [config npm package](https://www.npmjs.com/package/config) with TypeScript files.

Environment-specific configs are defined in the [config directory](./config/). For detailed configuration documentation, see [config/README.md](./config/README.md).

## Database Access

### pgAdmin

Access pgAdmin at http://localhost:5050

**Default credentials:**
- Email: `admin@admin.com`
- Password: `admin`

**Add PostgreSQL server in pgAdmin:**
1. Right-click "Servers" → "Register" → "Server"
2. **General** tab: Name = `Local GameDev DB`
3. **Connection** tab:
   - Host: `postgres` (or `localhost` if connecting from host machine)
   - Port: `5432`
   - Database: `gamedev_catalogue`
   - Username: `postgres`
   - Password: `postgres`

### Direct PostgreSQL Connection

```bash
# Using psql (if installed locally)
psql -h localhost -p 5432 -U postgres -d gamedev_catalogue

# Using Docker
docker exec -it gamedev_postgres psql -U postgres -d gamedev_catalogue
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

```bash
# Change PORT in .env
PORT=3001

# Or change DB_PORT in .env and docker-compose.yml
DB_PORT=5433
```

### Database Connection Failed

**Check if PostgreSQL is running:**
```bash
docker-compose ps
```

**Restart database:**
```bash
docker-compose restart postgres
```

**View database logs:**
```bash
docker-compose logs postgres
```

### Migration Errors

**Reset database (⚠️ destroys all data):**
```bash
docker-compose down -v
docker-compose up -d
pnpm migration:run
pnpm seed  # Optional: reseed with sample data
```

**Check migration status:**
```bash
pnpm typeorm migration:show -d backend/data-source.ts
```

### Module Not Found

**Clear cache and reinstall:**
```bash
rm -rf node_modules dist
pnpm install
```

### TypeScript Errors

**Rebuild project:**
```bash
pnpm build:backend
```

### Test Failures

**Clear test cache:**
```bash
pnpm test --clearCache
```

### pnpm Issues

**Check pnpm version:**
```bash
pnpm --version
# Should be >= 8.0.0
```

**Update pnpm:**
```bash
npm install -g pnpm@latest
```

## Development Workflow

### Adding a New Feature

1. Create a new branch
2. Make changes to backend/frontend
3. Generate migration if database schema changed:
   ```bash
   pnpm migration:generate migrations/FeatureName
   ```
4. Run tests: `pnpm test`
5. Run linter: `pnpm lint:fix`
6. Commit and push

### Database Schema Changes

1. Modify TypeORM entities in `backend/entities/`
2. Generate migration:
   ```bash
   pnpm migration:generate migrations/DescriptiveChangeName
   ```
3. Review generated migration in `migrations/`
4. Apply migration:
   ```bash
   pnpm migration:run
   ```
5. Update seed data in `backend/seeds/seed.ts` if needed
6. Reseed database (optional):
   ```bash
   pnpm seed
   ```

## Production Deployment

1. Set environment variables:
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

2. Build application:
   ```bash
   pnpm build
   ```

3. Run migrations:
   ```bash
   pnpm migration:run
   ```

4. Start server:
   ```bash
   pnpm start:prod
   ```

**Important:**
- Never use `synchronize: true` in production. Always use migrations.
- **Do not** run `pnpm seed` in production - seed data is for development/testing only.

## License

Unlicensed project.
