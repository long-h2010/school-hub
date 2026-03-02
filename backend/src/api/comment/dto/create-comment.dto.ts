import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  post: string;

  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  content: string;
}
