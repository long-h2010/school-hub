import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/api/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import UserStatus from 'src/common/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateToken(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ id: userId }),
      this.jwtService.signAsync({ id: userId }, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findOne(verify.id);
      return (await this.generateToken(user._id.toString())).accessToken;
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not valid or expired');
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, name, password, confirmPassword } = registerDto;

    if (password !== confirmPassword)
      throw new UnauthorizedException('Confirm password does not match');

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.userService.findByUsername(username);
    if (existingUser)
      throw new UnauthorizedException('Username already exists');

    const newUser = {
      username: username,
      name: name,
      password: hashedPassword,
    };

    return await this.userService.create(newUser);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status == UserStatus.BANNED)
      throw new UnauthorizedException('Account has been banned');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = await this.generateToken(user._id.toString());
    const { password: _, ...userData } = user.toObject();
    const res = {
      ...token,
      user: userData,
    };

    return res;
  }

  async googleLogin(payload: any) {
    const email = payload.email;
    const [username, verify] = email.split('@');

    const verifyEmail = process.env.VERIFY_EMAIL;
    if (verify != verifyEmail && verifyEmail)
      throw new UnauthorizedException('Email is not accepted');

    const user = await this.userService.findByUsername(username);

    if (user) {
      const token = await this.generateToken(user._id.toString());
      const { password: _, ...userData } = user.toObject();
      const res = {
        ...token,
        user: userData,
      };

      return res;
    } else {
      const data = {
        name: payload.name,
        username: username,
        email: email,
        avatar: payload.picture,
      };

      const newUser = await this.userService.create(data);

      const token = await this.generateToken(newUser._id.toString());
      const { password: _, ...userData } = newUser.toObject();
      const res = {
        ...token,
        user: userData,
      };

      return res;
    }
  }

  async getMe(userId: string) {
    return await this.userService.findOne(userId);
  }
}
