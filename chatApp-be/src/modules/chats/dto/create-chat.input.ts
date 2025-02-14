import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];
}
