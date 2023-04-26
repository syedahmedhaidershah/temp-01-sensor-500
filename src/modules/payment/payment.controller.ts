import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Authorization, GetCurrentUser } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { CreateCustomerUserData } from './thirdparty/stripe/types';
import { RegisterPaymentMethodDto } from './dto/register-payment-method.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) { }

  @Authorization(Role.User, Role.Vacationer)
  @Post('register/user')
  create(
    @GetCurrentUser() userData: CreateCustomerUserData
  ) {
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
  ) {
    const methodCreated = await this.paymentService.createPaymentMethod(
      userData,
      attachPaymentMethodPayload,
    );

    const {
      customerId,
    } = attachPaymentMethodPayload;

    const attached = this.paymentService
      .attachPaymentPethod({
        customerId,
        paymentMethodData: methodCreated,
      });

    return attached;
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
