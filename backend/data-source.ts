import config from 'config';
import { DataSource } from 'typeorm';

// node scripts required for "pnpm run migration:<command>" to work
export const AppDataSource = new DataSource({
  ...config.get('database'),
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
});
