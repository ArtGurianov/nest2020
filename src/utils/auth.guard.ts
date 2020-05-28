import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common'
import {GqlContextType, GqlExecutionContext} from '@nestjs/graphql'
import {JwtService} from './jwt.service'

export class AuthGuard implements CanActivate {
  public constructor(
    @Inject('JwtService') private readonly jwtService: JwtService,
  ) {}

  getContextAndRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context)
      return {ctx: ctx.getContext(), req: ctx.getContext().req}
    } else {
      return {
        ctx: context.switchToHttp(),
        req: context.switchToHttp().getRequest(),
      }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const {ctx, req} = this.getContextAndRequest(context)
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException('Please login to access this resource!')
    }
    try {
      const token = authHeader.split(' ')[1]
      const jwtPayload = this.jwtService.verifyAccessToken(token)
      if (!jwtPayload)
        throw new UnauthorizedException('Please login to access this resource!')
      ctx.jwtPayload = jwtPayload as any
      req.jwtPayload = jwtPayload as any
      return true
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Please login to access this resource!')
    }
  }
}
