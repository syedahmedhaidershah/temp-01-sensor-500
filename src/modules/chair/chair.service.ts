import { Injectable } from '@nestjs/common';
import { Chair } from 'src/database/mongoose/schemas';
import { CreateChairDto } from './dto/create-chair.dto';
import { UpdateChairDto } from './dto/update-chair.dto';
import { ChairType } from './types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDefaultQuery, PaginationDefaultQueryOptions } from 'src/common/interfaces';

@Injectable()
export class ChairService {
  constructor(
    @InjectModel(Chair.name) private readonly chairModel: Model<ChairType>,
  ) { }
  async create(createChairDto: CreateChairDto): Promise<ChairType> {
    const createdChair = new this.chairModel(createChairDto);
    return await createdChair.save();
  }

  async findAll(
    query: PaginationDefaultQuery = { },
    options: PaginationDefaultQueryOptions = {}
  ): Promise<ChairType[]> {
    const { skip = 0, limit = 1 } = query;

    const { matchQuery = {} } = options;

    /**
     * @note Using pages logic for pagination, if we would be going for infinite scrolling, we would:
     * 1. Switch Mongoose methods by raw aggregation query
     * 2. Use Exclusion with IDs + indexes for performance
     */
    const allChairs = await this.chairModel
      .find(matchQuery)
      .skip(+skip * +limit)
      .limit(+limit);

    return allChairs;
  }

  /**
   * This returns a chair using Mongoose Object Id
   */
  async findOne(id: string): Promise<ChairType | null> {
    const found = await this.findAll({}, { matchQuery: { _id: id } }) || [];
    return found.pop() || null;
  }

  async update(id: string, updateChairDto: UpdateChairDto): Promise<ChairType | null> {
    const updatedChair = await this.chairModel.findByIdAndUpdate(id, updateChairDto, { new: true });
    return updatedChair || null;
  }

  async remove(id: string): Promise<boolean> {
    const deletedChair = await this.chairModel.findByIdAndDelete(id);
    return Boolean(deletedChair);
  }

  async findById(id: string): Promise<ChairType | null> {
    const found = await this.chairModel.findOne({ id });
    return found || null;
  }
}
