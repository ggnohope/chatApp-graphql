import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from '../services/chats.service';
import { Chat } from '../entities/chat.entity';
import { CreateChatInput } from '../dto/create-chat.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { PaginationArgs } from '../dto/pagination-chat.args';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation(() => Chat)
  @UseGuards(JwtAuthGuard)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Chat> {
    return this.chatsService.create(createChatInput, user);
  }

  // @Query(() => [Chat], { name: 'chats' })
  // @UseGuards(JwtAuthGuard)
  // findAll(@CurrentUser() user: TokenPayload): Promise<Chat[]> {
  //   return this.chatsService.findAll({ userId: user._id.toString() });
  // }

  @Query(() => [Chat], { name: 'chats' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @CurrentUser() user: TokenPayload,
  ): Promise<Chat[]> {
    return this.chatsService.findMany({
      prePipelineStages: [],
      paginationArgs,
      userId: user._id,
    });
  }

  @Query(() => Chat, { name: 'chat' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('_id') _id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Chat> {
    return this.chatsService.findOne({ _id, userId: user._id });
  }
}
