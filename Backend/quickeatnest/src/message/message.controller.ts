import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageservice: MessageService) {}
  @Post('/message')
  async messages(
    @Body()
    body: {
      username: string;
      message: string;
      userId: string;
      mode: boolean;
      timeStamp: string;
      date: Date | any;
    },
  ) {
    const { username, message, userId, mode, timeStamp, date } = body;
    await this.messageservice.trigger('chat', 'message', {
      username,
      message,
      userId,
      mode,
      timeStamp,
      date,
    });
    return { success: true }; // Assuming you want to return a success response
  }

  @Get('/allmessage')
  getAllMessage() {
    return this.messageservice.getAllMessage();
  }

  @Get('/getUserMessage/:id')
  getMessageByUser(@Param('id') id: string) {
    return this.messageservice.getMessageByUser(id);
  }
}
