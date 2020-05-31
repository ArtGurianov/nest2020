import {UseGuards} from '@nestjs/common'
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {CustomError} from '../types/CustomError'
import {MyContext} from '../types/myContext'
import {AuthGuard} from '../utils/auth.guard'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {
  LoginResult,
  LogoutResult,
  MeResult,
  RegistrationResult,
  RevokeRefreshTokenResult,
  UserResult,
} from './user.customResults'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => String)
  protectedGqlEndpoint(@Context() ctx: MyContext) {
    return `Protected GQL endpoint reached! your id is: ${ctx.jwtPayload?.userId}`
  }

  @Query(() => [UserResult])
  async users(): Promise<Array<typeof UserResult>> {
    return await this.userService.users()
  }

  @Mutation(() => RegistrationResult)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<typeof RegistrationResult> {
    const result = await this.userService.register(registerInput)
    return result
  }

  @Mutation(() => LoginResult)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: MyContext,
  ): Promise<typeof LoginResult> {
    const result = await this.userService.login(loginInput, ctx)
    return result
  }

  @Mutation(() => LogoutResult)
  async logout(@Context() ctx: MyContext): Promise<typeof LogoutResult> {
    const result = await this.userService.logout(ctx)
    return result
  }

  @Query(() => MeResult, {nullable: true})
  async me(@Context() ctx: MyContext): Promise<typeof MeResult> {
    const user = await this.userService.me(ctx)
    return user ? user : new CustomError({errorMessage: 'could not fetch user'})
  }

  @Mutation(() => RevokeRefreshTokenResult)
  async revokeRefreshToken(
    @Args('userId') userId: string,
  ): Promise<typeof RevokeRefreshTokenResult> {
    const success = await this.userService.revokeRefreshToken(userId)
    return success
  }
}
