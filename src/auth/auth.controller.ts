import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { VatsimAuthGuard } from './vatsim/vatsim-auth.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * Redirect user to this route to initiate login process.
   * If this route is called with a code query parameter, it
   * will return the relevant TMS user record
   */
  @Get('vatsim')
  @UseGuards(VatsimAuthGuard)
  getUserFromVatsimLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, expiresIn, refreshToken } = this.authService.getTokens(
      req.user,
    );

    const cookieName = this.configService.get<string>('COOKIE_NAME');
    res.cookie(cookieName, refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: this.configService.get<string>('COOKIE_DOMAIN') !== 'localhost',
      signed: true,
    });

    return { ...req.user, token, expiresIn };
  }

  @Get('silent')
  async getUserFromRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieName = this.configService.get<string>('COOKIE_NAME');
    const refreshToken = req.signedCookies[cookieName];

    if (refreshToken === undefined) {
      throw new UnauthorizedException();
    }

    const { user, token, expiresIn, newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie(cookieName, newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: this.configService.get<string>('COOKIE_DOMAIN') !== 'localhost',
      signed: true,
    });

    return { user, token, expiresIn };
  }

  @Get('logout')
  async clearRefreshToken(@Res({ passthrough: true }) res: Response) {
    const cookieName = this.configService.get<string>('COOKIE_NAME');
    res.cookie(cookieName, '', {
      httpOnly: true,
      maxAge: 0,
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: this.configService.get<string>('COOKIE_DOMAIN') !== 'localhost',
      signed: true,
    });
  }
}
