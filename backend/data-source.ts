import config from 'config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  ...config.get('database'),
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
});
