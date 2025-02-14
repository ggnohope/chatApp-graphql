import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min, IsInt } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @IsInt({ message: 'skip must be an integer' })
  @Min(0, { message: 'skip must be greater than or equal to 0' })
  skip: number;

  @Field(() => Int)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit: number;
}
