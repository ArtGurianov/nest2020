import {Controller, Get, Req, UseGuards} from '@nestjs/common'
import {Request} from 'express'
import {AuthGuard} from '../utils/auth.guard'
//import {AuthGuard} from '../utils/auth.guard'

@Controller('user')
export class UserController {
  //constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/protectedRestEndpoint')
  async protectedRestEndpoint(@Req() req: Request) {
    return `Protected GQL endpoint reached! Your id is ${req.jwtPayload?.userId}`
  }
}
