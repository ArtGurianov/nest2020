import {Request, Response} from 'express'
import {JwtPayload} from './jwtPayload'

export interface MyContext {
  req: Request
  res: Response
  jwtPayload?: JwtPayload
}
