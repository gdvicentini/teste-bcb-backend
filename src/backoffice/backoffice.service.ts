import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client-module/entities/client-module.entity';

@Injectable()
export class BackofficeService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async addCredits(clientId: number, amount: number): Promise<Client> {
    if (amount <= 0) {
      throw new BadRequestException('O valor informado deve ser maior que zero.');
    }

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado na base de dados.');
    }

    if (client.planType !== 'pre-pago') {
      throw new BadRequestException('Créditos só podem ser adicionados para clientes pré-pagos.');
    }

    client.balance = parseFloat((parseFloat(client.balance.toString()) + amount).toFixed(2));
    console.log(`Novo saldo do cliente: ${client.balance}`);
    return this.clientRepository.save(client);
  }

  async updateCreditLimit(clientId: number, newLimit: number): Promise<Client> {
    if (newLimit === undefined || newLimit === null) {
      throw new BadRequestException('O novo limite de crédito é obrigatório ser informado.');
    }

    if (newLimit < 0) {
      throw new BadRequestException('O limite de crédito não pode ser negativo.');
    }

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado na base de dados.');
    }

    if (client.planType !== 'pos-pago') {
      throw new BadRequestException('Limites só podem ser atualizados para clientes pós-pago.');
    }

    console.log(`Novo limite de crédito: ${newLimit}`);
    client.creditLimit = parseFloat(newLimit.toString());
    await this.clientRepository.save(client);
    console.log(`Cliente atualizado: ${client}`);
    return client;
  }

  async updatePlan(clientId: number, newPlan: 'pre-pago' | 'pos-pago'): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado na base de dados.');
    }

    if (client.planType === newPlan) {
      throw new BadRequestException(`O cliente já está no plano ${newPlan}.`);
    }

    client.planType = newPlan;

    if (newPlan === 'pre-pago') {
      client.creditLimit = null;
      client.balance = 0; // Reseta o saldo
    } else if (newPlan === 'pos-pago') {
      client.creditLimit = 100;
    }

    return this.clientRepository.save(client);
  }

  async getClientDetails(clientId: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado na base de dados.');
    }
    return client;
  }
}

