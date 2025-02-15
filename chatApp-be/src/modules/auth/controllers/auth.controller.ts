import { AuthService } from '../services/auth.service';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';
import { GoogleAuthGuard } from '../guards/googleAuth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: TokenPayload) {
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Res() res: Response) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@CurrentUser() user: TokenPayload, @Res() res: Response) {
    const { token } = this.authService.login(user);
    return res.redirect(
      `${this.configService.getOrThrow('FRONTEND_URL')}/auth/google/callback?token=${token}`,
    );
  }
}
