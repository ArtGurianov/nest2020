import {UseGuards} from '@nestjs/common'
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {LoginResponse} from '../auth/loginResponse'
import {MyContext} from '../types/myContext'
import {AuthGuard} from '../utils/auth.guard'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {User} from './user.entity'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => String)
  protectedGqlEndpoint(@Context() ctx: MyContext) {
    return `Protected GQL endpoint reached! your id is: ${ctx.jwtPayload?.userId}`
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
