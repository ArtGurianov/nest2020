import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {sign, verify} from 'jsonwebtoken'
import {User} from '../user/user.entity'

@Injectable()
export class JwtService {
  public constructor(private readonly configService: ConfigService) {}

  createAccessToken(user: User) {
    return sign(
      {userId: user.id},
      this.configService.get<string>(
        'jwtAccessSecret',
        '!insecure default value!',
      ),
      {expiresIn: '15m'},
    )
  }

  createRefreshToken(user: User) {
    return sign(
      {userId: user.id},
      this.configService.get<string>(
        'jwtRefreshSecret',
        '!insecure default value!',
      ),
      {expiresIn: '7d'},
    )
  }

  verifyAccessToken(jid: string) {
    let payload: any
    try {
      payload = verify(
        jid,
        this.configService.get<string>(
          'jwtAccessSecret',
          '!insecure default value!',
        ),
      )
    } catch (e) {
      console.log(e)
      return null
    }

    return payload ? payload : null
  }

  verifyRefreshToken(jid: string) {
    let payload: any
    try {
      payload = verify(
        jid,
        this.configService.get<string>(
          'jwtRefreshSecret',
          '!insecure default value!',
        ),
      )
    } catch (e) {
      console.log(e)
      return null
    }

    return payload ? payload : null
  }
}
