import {Field, ObjectType} from '@nestjs/graphql'

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
  }

  @Field(() => [CustomError])
  errors: CustomError[]
}
