# Database Migrations

This directory contains TypeORM migrations for the database schema.

## Commands

Generate a new migration:
```bash
pnpm migration:generate migrations/MigrationName
```

Run migrations:
```bash
pnpm migration:run
```

Revert last migration:
```bash
pnpm migration:revert
```

## Best Practices

- Always generate migrations after modifying entities
- Review generated migrations before running them
- Never edit migrations that have been applied to production
- Keep migrations in version control
