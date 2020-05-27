import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import {LoginResponse} from '../auth/loginResponse'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return await this.userService.users()
  }

  @Mutation(() => Boolean)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const result = await this.userService.register(registerInput)
    return result
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const result = await this.userService.login(loginInput)
    return result
  }
}
