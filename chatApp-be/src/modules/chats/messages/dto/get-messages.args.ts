import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@ArgsType()
export class GetMessagesArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @Field(() => Int)
  @IsInt({ message: 'skip must be an integer' })
  @Min(0, { message: 'skip must be greater than or equal to 0' })
  skip: number;

  @Field(() => Int)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit: number;
}
