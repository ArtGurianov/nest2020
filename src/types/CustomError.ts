import {Field, ObjectType} from '@nestjs/graphql'

export interface CustomErrorInterface {
  errorMessage: string
}

@ObjectType()
export class CustomError implements CustomErrorInterface {
  constructor({errorMessage}: CustomErrorInterface) {
    this.errorMessage = errorMessage
  }

  @Field(() => String!)
  errorMessage!: string
}
