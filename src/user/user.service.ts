import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import {sign} from 'jsonwebtoken'
import {LoginResponse} from '../auth/loginResponse'
import {MyContext} from '../types/myContext'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  public constructor(private readonly configService: ConfigService) {}

  @InjectRepository(UserRepository)
  private readonly userRepo: UserRepository

  async users(): Promise<User[]> {
    return this.userRepo.find()
  }

  async register(registerInput: RegisterInput): Promise<boolean> {
    try {
      await this.userRepo.save({...registerInput})
    } catch {
      return false
    }
    return true
  }

  async login(
    {email, password}: LoginInput,
    {res}: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({where: {email}})
    if (!user) {
      throw new Error('Cannot find user')
    }
    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('wrong password')
    }
    res.cookie(
      'jid',
      sign(
        {userId: user.id},
        this.configService.get<string>(
          'jwtRefreshSecret',
          '!insecure default value!',
        ),
        {
          expiresIn: '7d',
        },
      ),
      {
        httpOnly: true,
      },
    )
    return {
      accessToken: sign(
        {userId: user.id},
        this.configService.get<string>(
          'jwtAccessSecret',
          '!insecure default value!',
        ),
        {expiresIn: '15m'},
      ),
    }
  }
}
