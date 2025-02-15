import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Abstract } from '../../../common/abstract/abstract.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class User extends Abstract {
  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true, unique: true })
  @Field()
  username: string;

  @Prop({ required: false })
  @Field({ nullable: true })
  profileImage?: string;

  @Prop({ required: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
