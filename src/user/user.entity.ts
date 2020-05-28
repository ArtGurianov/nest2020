import {Field, ID, ObjectType} from '@nestjs/graphql'
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @Column({type: 'text', unique: true, nullable: false})
  email!: string

  @Column({type: 'text', nullable: false})
  password!: string

  @Field()
  @Column({type: 'int', default: 0})
  tokenVersion: number
}
