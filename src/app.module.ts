import {Module} from '@nestjs/common'
import {GraphQLModule} from '@nestjs/graphql'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {typeOrmConfig} from './typeOrmConfig'
import {UserModule} from './user/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      // autoSchemaFile: true,
      // path: path.join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({req, res}) => ({
        req,
        res,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
