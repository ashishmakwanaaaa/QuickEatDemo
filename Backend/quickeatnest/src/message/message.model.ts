import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Message {
  @Prop()
  message: string;

  @Prop()
  sender: string;

  @Prop()
  username: string;

  @Prop()
  timeStamp: string;

  @Prop()
  date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
