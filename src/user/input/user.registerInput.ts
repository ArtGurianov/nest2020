import {Field, InputType} from '@nestjs/graphql'
import {IsEmail, IsString, Matches, MaxLength, MinLength} from 'class-validator'

@InputType({description: 'New user data'})
//export class RegisterInput implements Partial<User> {
export class RegisterInput {
  //   @Field()
  //   @IsString()
  //   @MinLength(4)
  //   @MaxLength(20)
  //   username: string

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
