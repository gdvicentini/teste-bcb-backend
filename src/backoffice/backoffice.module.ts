import { Module } from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { BackofficeController } from './backoffice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client-module/entities/client-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [BackofficeService],
  controllers: [BackofficeController]
})
export class BackofficeModule {}
