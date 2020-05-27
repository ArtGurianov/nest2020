import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserRepository} from './user.repository'
import {UserResolver} from './user.resolver'
import {UserService} from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserResolver, UserService, ConfigService],
  controllers: [],
})
export class UserModule {}
