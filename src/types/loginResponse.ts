import {Field, ObjectType} from '@nestjs/graphql'
import {User} from '../user/user.entity'

interface LoginResponseInterface {
  accessToken: string
  user: User
}

@ObjectType()
export class LoginResponse {
  constructor({accessToken, user}: LoginResponseInterface) {
    this.accessToken = accessToken
    this.user = user
  }
  @Field()
  accessToken: string
  @Field(() => User)
  user: User
}
