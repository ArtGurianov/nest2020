import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  name: 'development',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'modept',
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  subscribers: ['src/**/*.subscriber{.ts,.js}'],
}
