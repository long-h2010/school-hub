import { ArrayMinSize, IsNotEmpty, IsOptional } from 'class-validator';

class MemberDto {
    user: string;
    isAccepted?: boolean
}

export class CreateChatDto {
    @IsOptional()
    @IsNotEmpty()
    groupName?: string;

    @ArrayMinSize(1)
    members: MemberDto[];

    @IsNotEmpty()
    @IsOptional()
    lastMessage?: string;
}
