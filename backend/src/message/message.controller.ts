import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import SendMessageDto from './dto/send-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @UseGuards(AuthGuard)
    async sendMessage(@Request() req: any, @Body() body: any) {
        const userId = req.user.id;
        const chatId = body.chatId;
        const data: SendMessageDto = {
            sendTo: body.sendTo,
            message: body.message
        };
        
        return await this.messageService.sendMessage(userId, chatId, data);
    }

    @Get(':chatId')
    @UseGuards(AuthGuard)
    async findMessageByChat(@Param('chatId') chatId: string) {
        return await this.messageService.findMessageByChat(chatId);
    }

    @Put('mask-readed/:chatId')
    @UseGuards(AuthGuard)
    async maskAsRead(@Request() req: any, @Param('chatId') chatId: string) {
        const userId = req.user.id;
        return await this.messageService.maskAsRead(userId, chatId)
    }
}
