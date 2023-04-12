import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Authorization, Public } from 'src/common/decorators';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from 'src/common/enums';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('change-password')
  @HttpCode(HttpStatus.CREATED)
  async changeUserPassword(@Body() changedPasswordDto: ChangePasswordDto) {
    return this.userService.changeUserPassword(changedPasswordDto);
  }

  @Authorization(Role.Admin, Role.SuperAdmin)
  @Post('change-password/admin')
  @HttpCode(HttpStatus.CREATED)
  async changeAdminPassword(@Body() changedPasswordDto: ChangePasswordDto) {
    return this.userService.changeAdminPassword(changedPasswordDto);
  }
}
