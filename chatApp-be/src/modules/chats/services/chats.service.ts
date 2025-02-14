import { ChatRepository } from './../repositories/chats.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from '../dto/create-chat.input';
import { MessageDocument } from '../messages/entities/message.document';
import { PipelineStage, Types } from 'mongoose';
import { PaginationArgs } from '../dto/pagination-chat.args';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';

@Injectable()
export class ChatsService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getMessagesCount({ chatId }: { chatId: string }) {
    const result = await this.chatRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $project: { messagesCount: { $size: '$messages' } } },
    ]);

    return result[0]?.messagesCount || 0;
  }

  async getCount() {
    return await this.chatRepository.model.countDocuments({});
  }

  async create(createChatInput: CreateChatInput, user: TokenPayload) {
    return await this.chatRepository.create({
      ...createChatInput,
      userId: new Types.ObjectId(user._id),
      messages: [],
      isPrivate: createChatInput.isPrivate,
      userIds: [
        ...createChatInput.userIds.map((_id) => new Types.ObjectId(_id)),
        new Types.ObjectId(user._id),
      ],
    });
  }

  async findMany({
    prePipelineStages,
    paginationArgs,
    userId,
  }: {
    prePipelineStages: PipelineStage[];
    paginationArgs?: PaginationArgs;
    userId: string;
  }) {
    const pipeline: PipelineStage[] = [
      ...prePipelineStages,
      {
        $match: {
          $or: [
            { isPrivate: false },
            { isPrivate: true, userIds: { $in: [new Types.ObjectId(userId)] } },
          ],
        },
      },
      {
        $set: {
          latestMessage: {
            $cond: [
              { $gt: [{ $size: '$messages' }, 0] },
              { $arrayElemAt: ['$messages', -1] },
              null,
            ],
          },
        },
      },
      { $unset: 'messages' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessageUser',
        },
      },
      {
        $set: {
          'latestMessage.user': { $arrayElemAt: ['$latestMessageUser', 0] },
        },
      },
      { $unset: ['latestMessage.userId', 'latestMessageUser'] },
      {
        $set: {
          'latestMessage.createdAt': {
            $ifNull: ['$latestMessage.createdAt', '$createdAt'],
          },
        },
      },
      { $sort: { 'latestMessage.createdAt': -1 } },
    ];

    if (paginationArgs) {
      const { skip, limit } = paginationArgs;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
    }

    const chats = await this.chatRepository.model.aggregate(pipeline);

    chats.forEach((chat) => {
      if (!chat.latestMessage || !chat.latestMessage._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.chatId = chat._id;
    });

    return chats;
  }

  async findOne({ _id, userId }: { _id: string; userId: string }) {
    const chats = await this.findMany({
      prePipelineStages: [{ $match: { _id: new Types.ObjectId(_id) } }],
      userId,
    });
    if (!chats[0]) {
      throw new NotFoundException(`Chat with id: ${_id} not found!`);
    }
    return chats[0];
  }

  // userChatFilter(userId: string) {
  //   return {
  //     $or: [
  //       { userId: userId },
  //       {
  //         userIds: {
  //           $in: [userId],
  //         },
  //       },
  //       {
  //         isPrivate: false,
  //       },
  //     ],
  //   };
  // }

  // async findOneAndUpdateMessages({
  //   chatId,
  //   userId,
  //   message,
  // }: {
  //   chatId: string;
  //   userId: string;
  //   message: MessageDocument;
  // }) {
  //   await this.chatRepository.findOneAndUpdate(
  //     {
  //       _id: chatId,
  //       ...this.userChatFilter(userId),
  //     },
  //     {
  //       $push: {
  //         messages: message,
  //       },
  //     },
  //   );
  // }

  async findOneAndUpdateMessages({
    chatId,
    userId,
    message,
  }: {
    chatId: string;
    userId: string;
    message: MessageDocument;
  }) {
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: message,
        },
      },
    );
  }

  // async findOneByUserId({
  //   chatId,
  //   userId,
  // }: {
  //   chatId: string;
  //   userId: string;
  // }) {
  //   return await this.chatRepository.findOne({
  //     _id: chatId,
  //     ...this.userChatFilter(userId),
  //   });
  // }

  async findAllMessages({
    chatId,
    skip,
    limit,
  }: {
    chatId: string;
    skip: number;
    limit: number;
  }) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new Error('Invalid chat ID');
    }

    return await this.chatRepository.model.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId' },
      { $set: { chatId: new Types.ObjectId(chatId) } },
    ]);
  }

  async findOneByUserId({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    return await this.chatRepository.findOne({
      _id: chatId,
    });
  }
}
