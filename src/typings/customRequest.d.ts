import {JwtPayload} from '../types/jwtPayload'

declare global {
  namespace Express {
    export interface Request {
      jwtPayload?: JwtPayload
    }
  }
}

//export {}
