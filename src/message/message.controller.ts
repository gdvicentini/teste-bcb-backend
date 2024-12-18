import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('api/v1/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body('clientId') clientId: number,
    @Body('phone') phone: string,
    @Body('text') text: string,
    @Body('isWhatsApp') isWhatsApp: boolean,
  ) {
    return this.messageService.sendMessage(clientId, phone, text, isWhatsApp);
  }

  @Get('client/:clientId')
  async getClientMessages(@Param('clientId') clientId: number) {
    return this.messageService.getClientMessages(clientId);
  }
}

