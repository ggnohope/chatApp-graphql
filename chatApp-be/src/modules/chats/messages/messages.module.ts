import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesResolver } from './resolvers/messages.resolver';
import { ChatsModule } from '../chats.module';
import { UsersModule } from 'src/modules/users/users.module';
import { MessagesController } from './controllers/messages.controller';

@Module({
  controllers: [MessagesController],
  imports: [forwardRef(() => ChatsModule), UsersModule],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
