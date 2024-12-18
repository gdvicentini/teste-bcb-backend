import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client-module/entities/client-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Client])],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
