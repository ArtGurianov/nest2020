import {UseFilters, UseGuards} from '@nestjs/common'
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {MyContext} from '../types/myContext'
import {AuthGuard} from '../utils/auth.guard'
import {ValidationFilter} from '../utils/validation.filter'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {loginValidationPipe} from './pipes/user.loginInput.pipe'
import {registerValidationPipe} from './pipes/user.registerInput.pipe'
import {LoginResult, RegistrationResult} from './user.customResults'
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
  async users(): Promise<User[]> {
    return await this.userService.users()
  }

  @Mutation(() => RegistrationResult)
  @UseFilters(new ValidationFilter())
  async register(
    @Args('registerInput', registerValidationPipe) registerInput: RegisterInput,
  ): Promise<typeof RegistrationResult> {
    return await this.userService.register(registerInput)
  }

  @Mutation(() => LoginResult)
  @UseFilters(new ValidationFilter())
  async login(
    @Args('loginInput', loginValidationPipe) loginInput: LoginInput,
    @Context() ctx: MyContext,
  ): Promise<typeof LoginResult> {
    const result = await this.userService.login(loginInput, ctx)
    return result
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: MyContext): Promise<boolean> {
    return await this.userService.logout(ctx)
  }

  @Query(() => User, {nullable: true})
  async me(@Context() ctx: MyContext): Promise<User> {
    return await this.userService.me(ctx)
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args('userId') userId: string): Promise<boolean> {
    return await this.userService.revokeRefreshToken(userId)
  }
}
