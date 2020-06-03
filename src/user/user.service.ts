import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import cookie from 'cookie'
import {Request, Response} from 'express'
import {BooleanResponse} from '../types/BooleanResponse'
import {LoginResponse} from '../types/loginResponse'
import {MyContext} from '../types/myContext'
import {JwtService} from '../utils/jwt.service'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {LoginResult, RegistrationResult} from './user.customResults'
import {User} from './user.entity'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  public constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(UserRepository)
  private readonly userRepo: UserRepository

  async users(): Promise<User[]> {
    const users = await this.userRepo.find()
    if (users) {
      return users
    } else {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }
  }

  async register(
    registerInput: RegisterInput,
  ): Promise<typeof RegistrationResult> {
    const result = await this.userRepo.save({...registerInput})
    if (!result) {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }

    return new BooleanResponse(true)
  }

  async login(
    {email, password}: LoginInput,
    {res}: MyContext,
  ): Promise<typeof LoginResult> {
    const user = await this.userRepo.findOne({where: {email}})
    if (!user) {
      throw new NotFoundException('Cannot find user.')
    }
    const valid = await compare(password, user.password)
    if (!valid) {
      throw new ForbiddenException('Wrong password.')
    }
    const refreshToken = this.jwtService.createRefreshToken(user)
    this.jwtService.sendRefreshToken(res, refreshToken)
    const accessToken = this.jwtService.createAccessToken(user)
    return new LoginResponse({accessToken, user})
  }

  async me(ctx: MyContext): Promise<User | null> {
    const authorization = ctx.req.headers['authorization']
    if (!authorization || !authorization.length)
      throw new UnauthorizedException()
    // return new CustomErrorsResult({
    //   errors: [{property: 'auth', errorMessages: ['Unauthorized']}],
    // })
    const token = authorization.split(' ')[1]
    if (!token) throw new UnauthorizedException()
    const jwtPayload = this.jwtService.verifyAccessToken(token)
    if (!jwtPayload) throw new UnauthorizedException('Broken jwt.')
    const user = await this.userRepo.findOne({id: jwtPayload.userId})
    if (!user)
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    return user
  }

  async revokeRefreshToken(userId: string): Promise<boolean> {
    const result = await this.userRepo.increment(
      {id: userId},
      'tokenVersion',
      1,
    )
    if (!result)
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    return true
  }

  async useRefreshToken(req: Request, res: Response): Promise<string> {
    if (!req.headers.cookie) {
      throw new UnauthorizedException('Cookie not provided.')
    }

    const parsed = cookie.parse(req.headers.cookie)

    if (!parsed.jid) {
      throw new UnauthorizedException('Refresh token not provided.')
    }

    const jwtPayload = this.jwtService.verifyRefreshToken(parsed.jid)

    if (!jwtPayload) {
      throw new UnauthorizedException('Broken jwt.')
    }

    const user = await this.userRepo.findOne({id: jwtPayload.userId})

    if (!user) {
      throw new NotFoundException('user not found')
    }

    const accessToken = this.jwtService.createAccessToken(user)

    if (!accessToken) {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }

    if (user.tokenVersion !== jwtPayload.tokenVersion) {
      throw new UnauthorizedException('Revoked token')
    }

    const refreshToken = this.jwtService.createRefreshToken(user)
    if (!refreshToken) {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }
    this.jwtService.sendRefreshToken(res, refreshToken)

    return accessToken
  }

  async logout({res}: MyContext): Promise<boolean> {
    this.jwtService.sendRefreshToken(res, '')
    return true
  }
}
