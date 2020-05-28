import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {GqlContextType, GqlExecutionContext} from '@nestjs/graphql'
import {verify} from 'jsonwebtoken'

export class AuthGuard implements CanActivate {
  public constructor(
    @Inject('ConfigService') private readonly configService: ConfigService,
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
    // if (context.getType() === 'http') {
    //   const ctx: any = context.switchToHttp()
    //   const req: Request = ctx.getRequest()
    //   const authHeader: any = req.headers.get('authorization')
    // } else if (context.getType<GqlContextType>() === 'graphql') {
    //   const ctx: any = GqlExecutionContext.create(context).getContext()
    //   const req: Request = ctx.Request
    //   //authHeader = req.headers['authorization']
    //   const authHeader: any = req.headers.get('authorization')
    // }
    const {ctx, req} = this.getContextAndRequest(context)
    const authHeader = req.headers['authorization']

    if (!authHeader)
      throw new UnauthorizedException('Please login to access this resource!')
    try {
      const token = authHeader.split(' ')[1]
      const jwtPayload = verify(
        token,
        this.configService.get('jwtAccessSecret', '!insecure default value!'),
      )
      ctx.jwtPayload = jwtPayload as any
      req.jwtPayload = jwtPayload as any
      return true
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Please login to access this resource!')
    }
  }
}

//TODO need to somehow pass jwtPayload to Controller endpoint.
