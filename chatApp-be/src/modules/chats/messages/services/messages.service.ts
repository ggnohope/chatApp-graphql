import { UsersService } from '../../../users/services/users.service';
import { ChatsService } from '../../services/chats.service';
import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { MESSAGE_CREATED_TRIGGER, PUB_SUB } from 'src/constants';
import { PubSub } from 'graphql-subscriptions';
import { MessageDocument } from '../entities/message.document';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  async getCount({ chatId }: { chatId: string }) {
    return await this.chatsService.getMessagesCount({ chatId });
  }

  async create({
    content,
    chatId,
    userId,
  }: {
    content: string;
    chatId: string;
    userId: string;
  }) {
    const messageDocument: MessageDocument = {
      content,
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(),
      createdAt: new Date(),
    };
    await this.chatsService.findOneAndUpdateMessages({
      chatId,
      userId,
      message: messageDocument,
    });

    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.usersService.findOne({ _id: userId }),
    };

    await this.pubsub.publish(MESSAGE_CREATED_TRIGGER, {
      message,
    });
    return message;
  }

  async findAll({
    chatId,
    skip,
    limit,
  }: {
    chatId: string;
    skip: number;
    limit: number;
  }) {
    return await this.chatsService.findAllMessages({ chatId, skip, limit });
  }

  async messageCreated() {
    return this.pubsub.asyncIterableIterator(MESSAGE_CREATED_TRIGGER);
  }
}
