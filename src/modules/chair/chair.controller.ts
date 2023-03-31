import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { PaginationDefaultQuery } from 'src/common/interfaces';
import { ChairService } from './chair.service';
import { CreateChairDto } from './dto/create-chair.dto';
import { UpdateChairDto } from './dto/update-chair.dto';
import { UpdateChairStateDto } from './dto/update-chair-state.dto';
import { ChairType } from './types';
import { ChairStates, Role } from 'src/common/enums';
import { Chair } from 'src/database/mongoose/schemas';
import { Authorization } from 'src/common/decorators';

@Authorization(Role.Admin)
@Controller('chair')
export class ChairController {
  constructor(
    private readonly chairService: ChairService,
  ) { }

  @Public()
  @Get('health-check')
  async healthCheck() {
    return 'ok';
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createChairDto: CreateChairDto): Promise<ChairType> {
    return this.chairService.create(createChairDto);
  }


  @Get()
  findAll(
    @Query() query: PaginationDefaultQuery
  ): Promise<ChairType[]> {
    return this.chairService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chairService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChairDto: UpdateChairDto) {
    return this.chairService.update(id, updateChairDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chairService.remove(id);
  }

  @Get('find-by-id/:id')
  findById(@Param('id') id: string) {
    return this.chairService.findById(id);
  }

  @Authorization(Role.SerivceAccount)
  @Get('update-chair-state/online/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToOnline(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOnline(id);
  }

  @Authorization(Role.Admin,Role.TechnicianAccount)
  @Get('update-chair-state/offline/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToOffline(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOffline(id);
  }

  @Authorization(Role.Vacationer,Role.Admin)
  @Get('update-chair-state/reserved/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToReserved(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToReserved(id);
  }

  @Authorization(Role.Vacationer)
  @Get('update-chair-state/opened/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToOpened(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOpened(id);
  }

  @Authorization(Role.SerivceAccount)
  @Get('update-chair-state/defective/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToDefect(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToDefect(id);
  }

  @Authorization(Role.Vacationer)
  @Get('update-chair-state/temporarily-defective/:id')
  @HttpCode(HttpStatus.OK)
  updateChairStateToTemporarilyDefective(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToTemporarilyDefective(id);
  }



  


}
