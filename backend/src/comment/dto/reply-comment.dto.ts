import { IsNotEmpty } from 'class-validator';

export class ReplyCommentDto {
    @IsNotEmpty()
    user: string;

    replyTo?: string;

    @IsNotEmpty()
    content: string;
}
