import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => String)
  @IsNotEmpty()
  chatId: string;
}
