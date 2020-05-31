import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import cookie from 'cookie'
import {Request, Response} from 'express'
import {BooleanResponse} from '../types/BooleanResponse'
import {CustomError} from '../types/CustomError'
import {MyContext} from '../types/myContext'
import {JwtService} from '../utils/jwt.service'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {
  LoginResult,
  LogoutResult,
  MeResult,
  RegistrationResult,
  RevokeRefreshTokenResult,
  UseRefreshTokenResult,
  UserResult,
} from './user.customResults'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  public constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(UserRepository)
  private readonly userRepo: UserRepository

  async users(): Promise<Array<typeof UserResult>> {
    return this.userRepo.find()
  }

  async register(
    registerInput: RegisterInput,
  ): Promise<typeof RegistrationResult> {
    try {
      await this.userRepo.save({...registerInput})
    } catch {
      return new BooleanResponse(false)
    }
    return new BooleanResponse(true)
  }

  async login(
    {email, password}: LoginInput,
    {res}: MyContext,
  ): Promise<typeof LoginResult> {
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
      user,
    }
  }

  async me(ctx: MyContext): Promise<typeof MeResult> {
    const authorization = ctx.req.headers['authorization']
    if (!authorization) return new CustomError({errorMessage: 'not authorized'})
    try {
      const token = authorization.split(' ')[1]
      const jwtPayload = this.jwtService.verifyAccessToken(token)
      const user = await this.userRepo.findOne({id: jwtPayload.userId})
      return user ? user : new CustomError({errorMessage: 'cannot find user'})
    } catch (err) {
      console.log(err)
      return new CustomError({errorMessage: 'something went wrong'})
    }
  }

  async revokeRefreshToken(
    userId: string,
  ): Promise<typeof RevokeRefreshTokenResult> {
    const result = await this.userRepo.increment(
      {id: userId},
      'tokenVersion',
      1,
    )
    return new BooleanResponse(!!result)
  }

  async useRefreshToken(
    req: Request,
    res: Response,
  ): Promise<typeof UseRefreshTokenResult> {
    if (!req.headers.cookie) {
      return new CustomError({errorMessage: 'No cookie in headers.'})
    }

    const {jid} = cookie.parse(req.headers.cookie)

    if (!jid) {
      return new CustomError({errorMessage: 'No cookie in headers.'})
    }

    const payload = this.jwtService.verifyRefreshToken(jid)

    if (!payload) {
      return new CustomError({errorMessage: 'Cannot parse your jwt'})
    }

    const user = await this.userRepo.findOne({id: payload.userId})

    if (!user) {
      return new CustomError({errorMessage: 'Cannot find user'})
    }

    const accessToken = this.jwtService.createAccessToken(user)

    if (!accessToken) {
      return new CustomError({errorMessage: 'Cannot create access token'})
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return new CustomError({errorMessage: 'Revoked token.'})
    }

    const refreshToken = this.jwtService.createRefreshToken(user)
    this.jwtService.sendRefreshToken(res, refreshToken)

    return accessToken
  }

  async logout({res}: MyContext): Promise<typeof LogoutResult> {
    this.jwtService.sendRefreshToken(res, '')
    return new BooleanResponse(true)
  }
}
