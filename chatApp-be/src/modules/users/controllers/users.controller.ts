import { UsersService } from './../services/users.service';
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async getCountUsers() {
    return this.usersService.getCountUsers();
  }

  @Get('profile-image')
  @UseGuards(JwtAuthGuard)
  async getProfileImage(@CurrentUser() user: TokenPayload) {
    return this.usersService.getProfileImage({ _id: user._id });
  }

  @Post('profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
  ) {
    return await this.usersService.uploadProfileImage(file, user);
  }
}
