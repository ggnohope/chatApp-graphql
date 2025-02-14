import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';
import { MessagesService } from '../services/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async getCount(@Query('chatId') chatId: string) {
    console.log(chatId);
    return await this.messagesService.getCount({ chatId });
  }
}
