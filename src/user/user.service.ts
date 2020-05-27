import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {compare} from 'bcryptjs'
import {sign} from 'jsonwebtoken'
import {LoginResponse} from '../auth/loginResponse'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  @InjectRepository(UserRepository)
  private readonly userRepo: UserRepository

  async users(): Promise<User[]> {
    return this.userRepo.find()
  }

  async register(registerInput: RegisterInput): Promise<boolean> {
    try {
      await this.userRepo.save({...registerInput})
    } catch {
      return false
    }
    return true
  }

  async login({email, password}: LoginInput): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({where: {email}})
    if (!user) {
      throw new Error('Cannot find user')
    }
    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('wrong password')
    }
    return {accessToken: sign({userId: user.id}, 'secret', {expiresIn: '15m'})}
  }
}
