import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { ChatsResolver } from './resolvers/chats.resolver';
import { ChatRepository } from './repositories/chats.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { ChatSchema } from './entities/chat.document';
import { MessagesModule } from './messages/messages.module';
import { Chat } from './entities/chat.entity';
import { ChatsController } from './controllers/chats.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
    forwardRef(() => MessagesModule),
  ],

  providers: [ChatsResolver, ChatsService, ChatRepository],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
