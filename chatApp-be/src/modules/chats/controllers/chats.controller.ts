import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async getCount() {
    return await this.chatsService.getCount();
  }
}
