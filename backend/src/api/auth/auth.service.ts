import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/api/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import UserStatus from 'src/common/enums/user-status.enum';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { SendOtpDto } from './dto/send-otp.dto';
import * as crypto from 'crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const user = await this.userService.findByEmailToResetPassword(dto.email);

    if (!user) {
      return { message: 'If this email exists, an OTP has been sent.' };
    }

    if (user.otpExpiry && user.otpExpiry > new Date(Date.now() - 60 * 1000)) {
      throw new BadRequestException(
        'An OTP was already sent recently. Please wait before requesting a new one.',
      );
    }

    const otp = crypto.randomInt(100_000, 999_999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.userService.update(user._id, {
      otp: hashedOtp,
      otpExpiry: otpExpiry,
    });

    await this.mailService.sendOtp({
      to: user.email,
      name: user.username,
      otp,
      expiresInMinutes: 5,
    });

    return { message: 'If this email exists, an OTP has been sent.' };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ message: string; accessToken: string }> {
    const user = await this.userService.findByEmailToResetPassword(dto.email);

    if (!user || !user.otp || !user.otpExpiry) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    if (user.otpExpiry < new Date()) {
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }

    const isMatch = await bcrypt.compare(dto.otp, user.otp);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.userService.update(user._id, {
      otp: null,
      otpExpiry: null,
    });

    const accessToken = this.jwtService.sign({
      sub: user._id,
      purpose: 'reset-password',
    });

    return { message: 'Email verified successfully.', accessToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    console.log(dto);
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(dto.resetToken);
    } catch {
      throw new BadRequestException('Reset token is invalid or has expired.');
    }

    if (payload.purpose !== 'reset-password') {
      throw new BadRequestException('Invalid reset token.');
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userService.update(user._id, { password: newPassword });

    return { message: 'Password has been reset successfully.' };
  }
}
