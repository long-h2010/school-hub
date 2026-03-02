import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly studentId: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
