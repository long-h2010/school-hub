import { IsNotEmpty } from 'class-validator';

class SendMessageDto {
  sendTo?: string;

  @IsNotEmpty()
  message: string;
}

export default SendMessageDto;
