import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PaymentAdapterService } from './payment-adapter/payment-adapter.service';

@Injectable()
export class PaymentService {

  constructor(
    private readonly payments: PaymentAdapterService
  ) { }

  async addUser(userData: RegisterUserDto) {
    return await this.payments.addUser(userData);
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
