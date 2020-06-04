import {Field, ID, ObjectType} from '@nestjs/graphql'
import {v4} from 'uuid'

export interface CustomErrorsInterface {
  errors: CustomError[]
}

@ObjectType()
export class CustomError {
  @Field(() => String)
  property: string
  @Field(() => [String])
  errorMessages: string[]
}

@ObjectType()
export class CustomErrorsResult implements CustomErrorsInterface {
  constructor({errors}: CustomErrorsInterface) {
    this.errors = errors
    this.id = v4()
  }

  @Field(() => ID)
  id: string

  @Field(() => [CustomError])
  errors: CustomError[]
}
