import { Injectable } from '@nestjs/common';
import { Chair } from 'src/database/mongoose/schemas';
import { CreateChairDto } from './dto/create-chair.dto';
import { UpdateChairDto } from './dto/update-chair.dto';
import { ChairType } from './types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChairService {
  constructor(
    @InjectModel(Chair.name) private readonly chairModel: Model<ChairType>,
  ) {}
  create(createChairDto: CreateChairDto):Promise<ChairType> {
    const createdChair = new this.chairModel(createChairDto);
    return createdChair.save();
  }

  async findAll():Promise<ChairType[]> {
    const allChairs = await this.chairModel.find();
    return allChairs;
  }

  findOne(id: number) {
    return `This action returns a #${id} chair`;
  }

  update(id: number, updateChairDto: UpdateChairDto) {
    return `This action updates a #${id} chair`;
  }

  remove(id: number) {
    return `This action removes a #${id} chair`;
  }
}
