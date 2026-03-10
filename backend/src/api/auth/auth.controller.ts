import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth-guard';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
);

const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  path: '/api/auth/refresh-token',
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.json({ accessToken, user });
  }

  @Post('google/login')
  async handleRedirect(
    @Body('token') token,
    @Res() res: Response,
  ): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(payload);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.json({ accessToken, user });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    return await this.authService.getMe(userId);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
    return res.sendStatus(200);
  }
}
