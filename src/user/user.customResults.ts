import {createUnionType, Field, ObjectType} from '@nestjs/graphql'
import {LoginResponse} from '../auth/loginResponse'
import {BooleanResponse} from '../types/BooleanResponse'
import {CustomError, CustomErrorInterface} from '../types/CustomError'
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

  @Field(() => String)
  emailErrorMessage?: string

  @Field(() => String)
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

  @Field(() => String)
  emailErrorMessage: string

  @Field(() => String)
  passwordErrorMessage: string
}

export const LoginResult = createUnionType({
  name: 'LoginResult',
  types: () => [LoginResponse, LoginError],
})

// ME RESULT
export const MeResult = createUnionType({
  name: 'MeResult',
  types: () => [User, CustomError],
})

// LOGOUT RESULT
export const LogoutResult = createUnionType({
  name: 'LogoutResult',
  types: () => [BooleanResponse, CustomError],
})

// REVOKE REFRESH TOKEN RESULT
export const RevokeRefreshTokenResult = createUnionType({
  name: 'RevokeRefreshTokenResult',
  types: () => [BooleanResponse, CustomError],
})

// USE REFRESH TOKEN RESULT
export const UseRefreshTokenResult = createUnionType({
  name: 'UseRefreshTokenResult',
  types: () => [String, CustomError],
})
