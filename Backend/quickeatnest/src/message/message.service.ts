import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Message } from './message.model';
import * as Pusher from 'pusher';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MessageService {
  pusher: Pusher;
  constructor(
    @InjectModel('messages') private readonly messagemodel: Model<Message>,
  ) {
    this.pusher = new Pusher({
      appId: process.env.pusherapiappid,
      key: process.env.pusherapikey,
      secret: process.env.pushersecretkey,
      cluster: process.env.pushercluster,
      useTLS: true,
    });
  }

  async trigger(
    channel: string,
    event: string,
    data: {
      username: string;
      message: string;
      userId: string;
      mode: boolean;
      timeStamp: string;
    },
  ) {
    console.log(channel, event, data);
    const message = await this.messagemodel.create({
      message: data.message,
      username: data.username,
      sender: data.userId,
      timeStamp: data.timeStamp,
    });
    console.log(message);
    await message.save();
    await this.pusher.trigger(channel, event, data);
    return [];
  }

  async getAllMessage() {
    try {
      let allmessage = await this.messagemodel.find();
      if (allmessage.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'All Message', allmessage };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMessageByUser(id: string) {
    try {
      let messagebyuser = await this.messagemodel.find({ sender: id });
      if (messagebyuser.length === 0) {
        throw new NotFoundException();
      }
      return { message: 'Get All Message By User', messagebyuser };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
