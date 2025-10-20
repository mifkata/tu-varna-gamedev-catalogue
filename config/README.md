# Configuration Documentation

This directory contains configuration files for the application. The configuration system uses the [config npm package](https://www.npmjs.com/package/config) to manage environment-specific settings.

## Configuration Files

- `default.ts` - Base configuration with default values
- `development.ts` - Development environment overrides
- `test.ts` - Test environment overrides
- `production.ts` - Production environment overrides
- `custom-environment-variables.ts` - Maps environment variables to config properties
- `config.d.ts` - TypeScript type definitions for configuration

## Environment Selection

The active configuration is determined by the `NODE_ENV` environment variable:
- `development` (default)
- `test`
- `production`

## Configuration Options

### Application Settings (`app`)

| Property | Type | Default | Environment Variable | Description |
|----------|------|---------|---------------------|-------------|
| `port` | number | `3000` | `PORT` | HTTP server port |
| `apiPrefix` | string | `"api"` | - | API route prefix |
| `loadFrontend` | boolean | `true` | - | Frontend application serving (set to `false` in tests) |
| `startListening` | boolean | `true` | - | Listen for HTTP connections (set to `false` in tests) |

### Fastify Settings (`fastify`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `logger` | boolean/object | `true` | Logger configuration. In development, uses `pino-pretty` for colorized output. Disabled in test environment. |

**Development Logger Options:**
```typescript
{
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname'
    }
  }
}
```

### Database Settings (`database`)

The database can be configured using either a connection URL or individual connection parameters.

#### Common Options

| Property | Type | Default | Environment Variable | Description |
|----------|------|---------|---------------------|-------------|
| `type` | string | `"postgres"` | - | Database type (currently only PostgreSQL is supported) |
| `synchronize` | boolean | `false` | - | Auto-create/update database schema (⚠️ dangerous in production) |
| `logging` | boolean | `false` | - | Enable TypeORM SQL logging |

**Environment-specific defaults:**
- Development: `synchronize: true`, `logging: true`
- Test: `synchronize: true`
- Production: `synchronize: false` (default)

#### Option 1: Connection URL

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `url` | string | `DATABASE_URL` | Full PostgreSQL connection string |

**Example:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/gamedev_catalogue
```

#### Option 2: Individual Parameters

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `host` | string | `DB_HOST` | Database host |
| `port` | number | `DB_PORT` | Database port |
| `username` | string | `DB_USERNAME` | Database username |
| `password` | string | `DB_PASSWORD` | Database password |
| `database` | string | `DB_DATABASE` | Database name |

### Environment Settings

| Property | Type | Default | Environment Variable | Description |
|----------|------|---------|---------------------|-------------|
| `env` | string | `"development"` | `NODE_ENV` | Application environment |

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database - Option 1: Connection URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gamedev_catalogue

# Database - Option 2: Individual parameters
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamedev_catalogue
```

## Docker Compose Configuration

The `docker-compose.yml` file uses the following environment variables with defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_DATABASE` | `gamedev_catalogue` | Database name |
| `DB_PORT` | `5432` | PostgreSQL port |
| `PGADMIN_EMAIL` | `admin@admin.com` | PgAdmin login email |
| `PGADMIN_PASSWORD` | `admin` | PgAdmin login password |

## Usage Examples

### Accessing Configuration in Code

```typescript
import config from 'config';
import type { IAppConfig } from './config/config.d';

const appConfig = config.get<IAppConfig['app']>('app');
const port = appConfig.port;

const dbConfig = config.get<IAppConfig['database']>('database');
```

### Setting Environment-Specific Values

**Development:**
```bash
NODE_ENV=development npm run start:dev
```

**Testing:**
```bash
NODE_ENV=test npm test
```

**Production:**
```bash
NODE_ENV=production npm run start:prod
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** to version control
2. **Database Synchronization**: Always set `synchronize: false` in production to prevent automatic schema changes
3. **Logging**: Disable verbose logging in production to avoid exposing sensitive information
4. **Credentials**: Use strong passwords and rotate them regularly
5. **Environment Variables**: Use secure secret management in production (e.g., AWS Secrets Manager, HashiCorp Vault)

## TypeScript Types

The configuration is fully typed. See [config.d.ts](./config.d.ts) for the complete type definitions.

## Troubleshooting

**Configuration not loading:**
- Ensure `NODE_ENV` is set correctly
- Check that `.env` file exists in the project root
- Verify `dotenv/config` is imported before accessing config

**Database connection fails:**
- Verify database credentials in environment variables
- Ensure PostgreSQL is running (use `docker-compose up` for local development)
- Check that the database exists or `synchronize` is enabled

**Type errors:**
- Ensure config values match the `IAppConfig` interface
- Check for typos in configuration property names
