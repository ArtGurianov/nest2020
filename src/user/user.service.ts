import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import {LoginResponse} from '../auth/loginResponse'
import {MyContext} from '../types/myContext'
import {JwtService} from '../utils/jwt.service'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  public constructor(private readonly jwtService: JwtService) {}

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
    res.cookie('jid', this.jwtService.createRefreshToken(user), {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
    return {
      accessToken: this.jwtService.createAccessToken(user),
    }
  }
}
