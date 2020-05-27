import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {GqlExecutionContext} from '@nestjs/graphql'
import {Request} from 'express'
import {verify} from 'jsonwebtoken'

export class AuthGuard implements CanActivate {
  public constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const req: Request = ctx.getContext().req
    const authorization = req.headers['authorization']
    if (!authorization)
      throw new UnauthorizedException('Please login to access this resource!')
    try {
      const token = authorization.split(' ')[1]
      const jwtPayload = verify(
        token,
        this.configService.get('jwtAccessSecret', '!insecure default value!'),
      )
      //ctx.jwtPayload = jwtPayload as any
      return true
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Please login to access this resource!')
    }
  }
}
