import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Request() req: any, @Body() body: any) {
        const userId = req.user.id;
        const members = [
            { user: userId, isAccepted: true },
            ...body.sendTo.map((id: string) => ({ user: id }))
        ];

        const data: CreateChatDto = {
            groupName: body.groupName,
            members
        };

        return await this.chatService.create(data);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Request() req: any, @Param('id') chatId: string) {
        const userId = req.user.id;
        return await this.chatService.findOne(userId, chatId);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAllByUserId(@Request() req: any) {
        const userId = req.user.id;
        return await this.chatService.findAllByUserId(userId);
    }

    @Put('accept/:chatId')
    @UseGuards(AuthGuard)
    async acceptChat(@Request() req: any, @Param('chatId') chatId: string) {
        const userId = req.user.id;
        return await this.chatService.acceptChat(chatId, userId);
    }
}
