import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common'
import {Request, Response} from 'express'
import {AuthGuard} from '../utils/auth.guard'
import {UserService} from './user.service'
//import {AuthGuard} from '../utils/auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/protectedRestEndpoint')
  async protectedRestEndpoint(@Req() req: Request) {
    return `Protected GQL endpoint reached! Your id is ${req.jwtPayload?.userId}`
  }

  @Post('/refresh_token')
  async useRefreshToken(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.userService.useRefreshToken(req)
    if (!accessToken) return res.send({ok: false, accessToken: ''})
    return res.send({ok: true, accessToken})
  }
}
