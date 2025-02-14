import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Abstract } from 'src/common/abstract/abstract.entity';
import { MessageDocument } from '../messages/entities/message.document';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatDocument extends Abstract {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [MessageDocument], default: [] })
  messages: MessageDocument[];

  @Prop({ type: Boolean, required: false })
  isPrivate?: boolean;

  @Prop({ type: [Types.ObjectId], required: false })
  userIds?: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
