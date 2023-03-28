import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginationDefaultQuery } from 'src/common/interfaces';
import { ChairService } from './chair.service';
import { CreateChairDto } from './dto/create-chair.dto';
import { UpdateChairDto } from './dto/update-chair.dto';
import { UpdateChairStateDto } from './dto/update-chair-state.dto';
import { ChairType } from './types';
import { ChairStates } from 'src/common/enums';
import { Chair } from 'src/database/mongoose/schemas';

@Controller('chair')
export class ChairController {
  constructor(private readonly chairService: ChairService) { }

  @Post()
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

  @Get('update-chair-state/online/:id')
  updateChairStateToOnline(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOnline(id);
  }

  @Get('update-chair-state/offline/:id')
  updateChairStateToOffline(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOffline(id);
  }

  @Get('update-chair-state/reserved/:id')
  updateChairStateToReserved(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToReserved(id);
  }

  @Get('update-chair-state/opened/:id')
  updateChairStateToOpened(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToOpened(id);
  }

  @Get('update-chair-state/defective/:id')
  updateChairStateToDefect(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToDefect(id);
  }

  @Get('update-chair-state/temporarily-defective/:id')
  updateChairStateToTemporarilyDefective(@Param('id') id: string): Promise<Chair> {
    return this.chairService.updateChairStateToTemporarilyDefective(id);
  }



  


}
