import {createUnionType, Field, ObjectType} from '@nestjs/graphql'
import {BooleanResponse} from '../types/BooleanResponse'
import {CustomError, CustomErrorInterface} from '../types/CustomError'
import {LoginResponse} from '../types/loginResponse'
import {User} from './user.entity'

// USER RESULT (not ME)
export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [User, CustomError],
})

// REGISTRATION RESULT
interface RegistrationErrorInterface extends CustomErrorInterface {
  emailErrorMessage?: string
  passwordErrorMessage?: string
}

@ObjectType()
export class RegistrationError extends CustomError {
  constructor({
    errorMessage,
    emailErrorMessage,
    passwordErrorMessage,
  }: RegistrationErrorInterface) {
    super({errorMessage})
    if (emailErrorMessage) {
      this.emailErrorMessage = emailErrorMessage
    }
    if (passwordErrorMessage) {
      this.passwordErrorMessage = passwordErrorMessage
    }
  }

  @Field(() => String, {nullable: true})
  emailErrorMessage?: string

  @Field(() => String, {nullable: true})
  passwordErrorMessage?: string
}

export const RegistrationResult = createUnionType({
  name: 'RegistrationResult',
  types: () => [BooleanResponse, RegistrationError],
})

// LOGIN RESULT
interface LoginErrorInterface extends CustomErrorInterface {
  emailErrorMessage?: string
  passwordErrorMessage?: string
}

@ObjectType()
export class LoginError extends CustomError {
  constructor({
    errorMessage,
    emailErrorMessage,
    passwordErrorMessage,
  }: LoginErrorInterface) {
    super({errorMessage})
    if (emailErrorMessage) {
      this.emailErrorMessage = emailErrorMessage
    }
    if (passwordErrorMessage) {
      this.passwordErrorMessage = passwordErrorMessage
    }
  }

  @Field(() => String, {nullable: true})
  emailErrorMessage?: string

  @Field(() => String, {nullable: true})
  passwordErrorMessage?: string
}

export const LoginResult = createUnionType({
  name: 'LoginResult',
  types: () => [LoginResponse, LoginError],
})
