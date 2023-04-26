import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PaymentAdapterService } from './payment-adapter/payment-adapter.service';
import { Role } from 'src/common/enums';
import { AttachMethodCustomerData, CreateCustomerUserData, CreateStripeCustomer } from './thirdparty/stripe/types';
import { RegisterPaymentMethodDto } from './dto/register-payment-method.dto';
import { Constants } from 'src/common/constants';
import Stripe from 'stripe';


@Injectable()
export class PaymentService {

  constructor(
    private readonly payments: PaymentAdapterService
  ) {
  }

  async getUserByEmail(email: string) {
    return await this.payments.getCustomerByEmail(email);
  }

  async addUser(
    userData: CreateCustomerUserData,
    options: CreateStripeCustomer,
  ) {
    return await this.payments.addUser(userData, options);
  }

  async createPaymentMethod(
    userData: CreateCustomerUserData,
    attachPaymentMethodPayload: RegisterPaymentMethodDto
  ) {
    const { email } = userData;

    const stripeCustomer = await this.payments.getCustomerByEmail(email);

    if (!stripeCustomer)
      throw new NotFoundException(Constants.ErrorMessages.STRIPE_CUSTOMER_NOT_REGISTERED);

    return await this.payments.createPaymentMethodForCustomer(attachPaymentMethodPayload);
  }

  async attachPaymentPethod(paymentMethodData: AttachMethodCustomerData) {
    return await this.payments.attachPaymentMethodToCustomer(paymentMethodData);
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
