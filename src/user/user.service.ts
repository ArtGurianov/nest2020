import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import cookie from 'cookie'
import {Request, Response} from 'express'
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
    const refreshToken = this.jwtService.createRefreshToken(user)
    this.jwtService.sendRefreshToken(res, refreshToken)
    return {
      accessToken: this.jwtService.createAccessToken(user),
    }
  }

  async revokeRefreshToken(userId: string) {
    const result = await this.userRepo.increment(
      {id: userId},
      'tokenVersion',
      1,
    )
    return !!result
  }

  async useRefreshToken(req: Request, res: Response): Promise<string | null> {
    if (!req.headers.cookie) {
      console.log('NO HEADERS COOKIE')
      return null
    }

    const {jid} = cookie.parse(req.headers.cookie)

    if (!jid) {
      console.log('NO JID')
      return null
    }

    console.log(jid)
    const payload = this.jwtService.verifyRefreshToken(jid)

    if (!payload) {
      console.log('PAYLOAD')
      return null
    }

    const user = await this.userRepo.findOne({id: payload.userId})

    if (!user) {
      console.log('NO USER')
      return null
    }

    const accessToken = this.jwtService.createAccessToken(user)

    if (!accessToken) {
      console.log('NO ACCESS TOKEN')
      return null
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      console.log('Used Refresh token')
      return null
    }

    const refreshToken = this.jwtService.createRefreshToken(user)
    this.jwtService.sendRefreshToken(res, refreshToken)

    return accessToken
  }
}
