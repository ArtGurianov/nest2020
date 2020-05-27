import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import {RegisterInput} from './input/user.registerInput'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  async hello() {
    return await this.userService.hello()
  }

  @Mutation(() => Boolean)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const result = await this.userService.register(registerInput)
    return result
  }
}
