import { Prop, Schema } from '@nestjs/mongoose';
import { Abstract } from 'src/common/abstract/abstract.entity';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class MessageDocument extends Abstract {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  createdAt: Date;
}
