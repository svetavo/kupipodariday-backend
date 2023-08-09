import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.db_host,
  port: parseInt(process.env.db_port),
  username: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db_name,
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
};
