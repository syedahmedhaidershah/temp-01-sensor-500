import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Authorization, GetCurrentUser } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) { }

  @Authorization(Role.User, Role.Vacationer)
  @Post('register/user')
  create(
    @GetCurrentUser() userData: RegisterUserDto
  ) {
    return this.paymentService
      .addUser(userData);
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
