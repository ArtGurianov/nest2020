import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  //name: 'development', //DON'T DO THIS! forFeature(ENTITY) will cause naming problem.
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'nest2020',
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
}
