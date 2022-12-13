import {
  getModelForClass,
  prop,
} from '@typegoose/typegoose';
import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class Group {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  /* TODO: nested functionality */
  @Field(() => [String])
  @prop({required: true})
  users: String[]
}

export const GroupModel = getModelForClass<typeof Group>(Group);

@InputType()
export class CreateGroupInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class DeleteGroupInput {
  @Field(() => String)
  _id: string;
}

@InputType()
export class UserGroupIdInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  groupId: string;
}