import {Request, Response} from 'express'

export interface MyContext {
  req: Request
  res: Response
  jwtPayload?: {userId: string}
}
