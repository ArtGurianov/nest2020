import {Field, InputType} from '@nestjs/graphql'
import {IsEmail, IsString, Matches, MaxLength, MinLength} from 'class-validator'
import {User} from '../user.entity'

@InputType({description: 'Login input data'})
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string
}
