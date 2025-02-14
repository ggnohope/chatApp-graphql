import { TokenPayload } from '../../../interfaces/tokenPayload.interface';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: TokenPayload) {
    const tokenPayload: TokenPayload = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(tokenPayload);

    return {
      message: 'Login successfully!',
      token: token,
    };
  }

  verifyWs(connectionParams: {
    headers: {
      Authorization: string;
    };
  }): TokenPayload {
    const authHeader = connectionParams.headers.Authorization;
    const bearerPrefix = 'Bearer ';

    if (authHeader && authHeader.startsWith(bearerPrefix)) {
      const token = authHeader.slice(bearerPrefix.length).trim();
      return this.jwtService.verify(token);
    }
    return null;
  }
}
