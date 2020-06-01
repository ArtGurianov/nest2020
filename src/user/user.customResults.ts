import {createUnionType} from '@nestjs/graphql'
import {BooleanResponse} from '../types/BooleanResponse'
import {CustomErrorsResult} from '../types/CustomErrorsResult'
import {LoginResponse} from '../types/loginResponse'
import {User} from './user.entity'

// USER RESULT (not ME)
export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [User, CustomErrorsResult],
})

// REGISTRATION RESULT

export const RegistrationResult = createUnionType({
  name: 'RegistrationResult',
  types: () => [BooleanResponse, CustomErrorsResult],
})

// LOGIN RESULT

export const LoginResult = createUnionType({
  name: 'LoginResult',
  types: () => [LoginResponse, CustomErrorsResult],
})
