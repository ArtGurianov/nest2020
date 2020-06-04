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
import {CustomError, CustomErrorsResult} from '../types/CustomErrorsResult'
import {LoginResponse} from '../types/loginResponse'
import {MyContext} from '../types/myContext'
import {JwtService} from '../utils/jwt.service'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {LoginResult, MeResult, RegistrationResult} from './user.customResults'
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
    const alreadyExists = await this.userRepo.findOne({
      email: registerInput.email,
    })
    if (alreadyExists)
      return new CustomErrorsResult({
        errors: [
          new CustomError({
            property: 'register',
            errorMessages: ['User already exists. Please login'],
          }),
        ],
      })
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
      return new CustomErrorsResult({
        errors: [
          new CustomError({
            property: 'login',
            errorMessages: ['User not registered!'],
          }),
        ],
      })
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

  async me(ctx: MyContext): Promise<typeof MeResult> {
    const authorization = ctx.req.headers['authorization']
    if (!authorization || !authorization.length) {
      //throw new UnauthorizedException()
      return new CustomErrorsResult({
        errors: [
          new CustomError({
            property: 'auth',
            errorMessages: ['no auth header'],
          }),
        ],
      })
    }

    const token = authorization.split(' ')[1]
    if (!token) {
      return new CustomErrorsResult({
        //throw new UnauthorizedException()
        errors: [
          new CustomError({
            property: 'auth',
            errorMessages: ['incorrect auth header'],
          }),
        ],
      })
    }
    const jwtPayload = this.jwtService.verifyAccessToken(token)
    if (!jwtPayload) {
      return new CustomErrorsResult({
        //throw new UnauthorizedException('Invalid jwt.')
        errors: [
          new CustomError({property: 'auth', errorMessages: ['Invalid jwt']}),
        ],
      })
    }
    const user = await this.userRepo.findOne({id: jwtPayload.userId})
    if (!user) throw new NotFoundException()
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
