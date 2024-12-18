import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ClientService } from './client-module.service';
import { Client } from './entities/client-module.entity';

@Controller('api/v1/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() clientData: Partial<Client>): Promise<Client> {
    return this.clientService.create(clientData);
  }

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() clientData: Partial<Client>,
  ): Promise<Client> {
    return this.clientService.update(id, clientData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.clientService.remove(id);
  }
}
