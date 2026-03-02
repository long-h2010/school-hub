import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;
}
