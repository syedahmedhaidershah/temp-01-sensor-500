import { Controller, Post, Body, Patch, Get, HttpCode, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Authorization, GetCurrentUser, Public } from 'src/common/decorators';
import { HttpStatus, Role } from 'src/common/enums';
import { CreateCustomerUserData } from './thirdparty/stripe/types';
import { RegisterPaymentMethodDto } from './dto/register-payment-method.dto';
import Stripe from 'stripe';
import { Document } from 'mongoose';
import { StripeCustomerType } from './thirdparty/stripe/types/stripe-customer-schema.type';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserType } from '../users/types';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) { }

  @Authorization(Role.User, Role.Vacationer)
  @Post('register/user')
  create(
    @GetCurrentUser() userData: CreateCustomerUserData
  ): Promise<StripeCustomerType & Document> {
    return this.paymentService
      .addUser(
        userData,
        { isGuest: userData.is_guest }
      );
  }

  @Authorization(Role.User, Role.Vacationer)
  @Patch('register/user-method')
  async registerPaymentMethodForUser(
    @GetCurrentUser() userData: CreateCustomerUserData,
    @Body() attachPaymentMethodPayload: RegisterPaymentMethodDto,
  ): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    const methodCreated = await this.paymentService.createPaymentMethodForCustomer(
      userData,
      attachPaymentMethodPayload,
    );

    return methodCreated;
  }

  @Authorization(Role.User, Role.Vacationer)
  @Post()
  async createPayment(
    @GetCurrentUser() userData: UserType,
    @Body() createPaymentPayload: CreatePaymentDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const created = await this.paymentService.createPayment(userData, createPaymentPayload);
    return created;
  }

  @Authorization(Role.User, Role.Vacationer)
  @Get('methods')
  async getPaymentMethods(
    @GetCurrentUser() userData: UserType,
  ): Promise<Array<Stripe.PaymentMethod>> {
    return await this.paymentService.getPaymentMethods(userData);
  }

  @Public()
  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(
    @Query() createPaymentQueryParams: any,
  ): Promise<any> {
    return { createPaymentQueryParams }
  }
}
