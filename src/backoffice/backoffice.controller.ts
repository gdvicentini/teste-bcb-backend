import { Controller, Patch, Get, Param, Body } from '@nestjs/common';
import { BackofficeService } from './backoffice.service';

@Controller('api/v1/backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Patch('add-credits/:clientId')
  async addCredits(
    @Param('clientId') clientId: number,
    @Body('amount') amount: number,
  ) {
    try {
      return this.backofficeService.addCredits(clientId, amount);
    } catch (err) {
      return console.error(err.message);
    }
  }

  @Patch('update-credit-limit/:clientId')
  async updateCreditLimit(
    @Param('clientId') clientId: number,
    @Body('newLimit') newLimit: number,
  ) {
    try {
      return this.backofficeService.updateCreditLimit(clientId, newLimit);
    } catch (err) {
      return console.error(err.message);
    }
  }

  @Patch('update-plan/:clientId')
  async updatePlan(
    @Param('clientId') clientId: number,
    @Body('newPlan') newPlan: 'pre-pago' | 'pos-pago',
  ) {
    try {
      return this.backofficeService.updatePlan(clientId, newPlan);
    } catch (err) {
      return console.error(err.message);
    }
  }

  @Get('client-details/:clientId')
  async getClientDetails(@Param('clientId') clientId: number) {
    return this.backofficeService.getClientDetails(clientId);
  }
}

