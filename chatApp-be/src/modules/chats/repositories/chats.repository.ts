import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import { Chat } from '../entities/chat.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument } from '../entities/chat.document';

@Injectable()
export class ChatRepository extends AbstractRepository<ChatDocument> {
  constructor(@InjectModel(Chat.name) model: Model<ChatDocument>) {
    super(model);
  }
}
