import { ObjectType, Field } from '@nestjs/graphql';
import { Abstract } from 'src/common/abstract/abstract.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Message extends Abstract {
  @Field(() => String)
  content: string;

  @Field(() => User)
  user: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  chatId: string;
}
