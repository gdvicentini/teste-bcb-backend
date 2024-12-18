import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Client } from '../client-module/entities/client-module.entity';

@Injectable()
export class MessageService {
  private readonly smsCost = 0.25;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async sendMessage(clientId: number, phone: string, text: string, isWhatsApp: boolean): Promise<Message> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado na base de dados');
    }

    if (client.planType === 'pre-pago') {
      if (client.balance < this.smsCost) {
        throw new BadRequestException('Seu saldo é insuficiente para enviar essa mensagem');
      }
      client.balance -= this.smsCost;
    } else if (client.planType === 'pos-pago') {
      const currentDebt = await this.calculateDebt(client.id);
      if (currentDebt + this.smsCost > client.creditLimit) {
        throw new BadRequestException('Limite de crédito do plano foi excedido');
      }
    }

    await this.clientRepository.save(client);

    const message = this.messageRepository.create({
      phone,
      text,
      isWhatsApp,
      client,
      status: 'sent',
    });

    return this.messageRepository.save(message);
  }

  async calculateDebt(clientId: number): Promise<number> {
    const messages = await this.messageRepository.find({ where: { client: { id: clientId } } });
    return messages.reduce((total, message) => total + this.smsCost, 0);
  }

  async getClientMessages(clientId: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { client: { id: clientId } }, order: { id: 'ASC' } });
  }
}

