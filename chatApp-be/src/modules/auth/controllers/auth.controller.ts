import { AuthService } from '../services/auth.service';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: TokenPayload) {
    return await this.authService.login(user);
  }
}
