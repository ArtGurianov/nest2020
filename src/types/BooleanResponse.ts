import {Field, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class BooleanResponse {
  constructor(booleanResponse: boolean) {
    this.booleanResponse = booleanResponse
  }

  @Field(() => Boolean!)
  booleanResponse!: boolean
}
