import { IsString as IsStr, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsStr()
  resetToken: string;

  @IsStr()
  @MinLength(8)
  newPassword: string;
}
