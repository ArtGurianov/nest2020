import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {JwtService} from '../utils/jwt.service'
import {UserController} from './user.controller'
import {UserRepository} from './user.repository'
import {UserResolver} from './user.resolver'
import {UserService} from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserResolver, UserService, JwtService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
