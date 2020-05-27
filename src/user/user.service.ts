import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {RegisterInput} from './input/user.registerInput'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  @InjectRepository(UserRepository)
  private readonly userRepo: UserRepository

  async hello(): Promise<string> {
    return 'жопа'
  }

  async register(registerInput: RegisterInput): Promise<boolean> {
    try {
      await this.userRepo.save({...registerInput})
    } catch {
      return false
    }
    return true
  }
}
