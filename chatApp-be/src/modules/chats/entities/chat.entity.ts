import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Abstract } from 'src/common/abstract/abstract.entity';
import { Message } from '../messages/entities/message.entity';

@ObjectType()
export class Chat extends Abstract {
  @Field(() => String)
  name: string;

  @Field(() => Message, { nullable: true })
  latestMessage?: Message;
}
