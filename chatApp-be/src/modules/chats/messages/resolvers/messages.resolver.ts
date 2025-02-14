import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { MessagesService } from '../services/messages.service';
import { Message } from '../entities/message.entity';
import { CreateMessageInput } from '../dto/create-message.input';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { PUB_SUB } from 'src/constants';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from '../dto/message-created.args';
import { GetMessagesArgs } from '../dto/get-messages.args';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(JwtAuthGuard)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message> {
    const { content, chatId } = createMessageInput;
    return this.messagesService.create({
      content,
      chatId,
      userId: user._id,
    });
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(JwtAuthGuard)
  findAll(@Args() getMessagesArgs: GetMessagesArgs): Promise<Message[]> {
    return this.messagesService.findAll({
      chatId: getMessagesArgs.chatId,
      skip: getMessagesArgs.skip,
      limit: getMessagesArgs.limit,
    });
  }

  @Subscription(() => Message, {
    filter: (payload, variables: MessageCreatedArgs, context) => {
      const userId = context.req.user._id;
      const createdMessage: Message = payload.message;
      return (
        variables.chatIds.includes(createdMessage.chatId) &&
        userId != createdMessage.user._id.toHexString()
      );
    },
    resolve: (payload) => payload.message,
  })
  messageCreated(@Args() _messageCreatedArgs: MessageCreatedArgs) {
    return this.messagesService.messageCreated();
  }
}
