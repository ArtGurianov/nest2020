import {UseGuards} from '@nestjs/common'
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {LoginResponse} from '../auth/loginResponse'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards()
  @Query(() => String)
  protected() {
    return "heyy I'm protected!"
  }

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
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: MyContext,
  ) {
    const result = await this.userService.login(loginInput, ctx)
    return result
  }
}
