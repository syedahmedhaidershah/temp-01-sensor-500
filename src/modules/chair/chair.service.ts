import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Chair } from 'src/database/mongoose/schemas';
import { CreateChairDto } from './dto/create-chair.dto';
import { UpdateChairDto } from './dto/update-chair.dto';
import { UpdateChairStateDto } from './dto/update-chair-state.dto';
import { ChairType } from './types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDefaultQuery, PaginationDefaultQueryOptions } from 'src/common/interfaces';
import { ChairStates } from 'src/common/enums';

@Injectable()
export class ChairService {
  constructor(
    @InjectModel(Chair.name) private readonly chairModel: Model<ChairType>,
  ) {}
  async create(createChairDto: CreateChairDto): Promise<ChairType> {
    const createdChair = new this.chairModel(createChairDto);
    return await createdChair.save();
  }

  async findAll(
    query: PaginationDefaultQuery = {},
    options: PaginationDefaultQueryOptions = {},
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
    const found = (await this.findAll({}, { matchQuery: { _id: id } })) || [];
    return found.pop() || null;
  }

  async update(
    id: string,
    updateChairDto: UpdateChairDto,
  ): Promise<ChairType | null> {
    const updatedChair = await this.chairModel.findByIdAndUpdate(
      id,
      updateChairDto,
      { new: true },
    );
    return updatedChair || null;
  }

  async remove(id: string): Promise<boolean> {
    const deletedChair = await this.chairModel.findByIdAndDelete(id);
    return Boolean(deletedChair);
  }

  async findById(id: string): Promise<ChairType | null> {
    const found = await this.chairModel.findOne({ id: id });
    return found || null;
  }

  async updateChairState(id: string,options:any): Promise<Chair | null> {
    const found = await this.chairModel.findOne({ _id:id });
    if(options.acceptedStates.includes(found.state)){
      const chair = await this.chairModel.findByIdAndUpdate(id, {
        state: options.stateToSet
      }, { new: true });
      return chair;
    }
    throw new NotAcceptableException('This action can`t be performed for this chair state');
  }

  async updateChairStateToOnline(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Offline,ChairStates.Reserved,ChairStates.TemporarilyDefective,ChairStates.Defective]
        ,
        stateToSet: ChairStates.Online
      }
    )
  }

  async updateChairStateToOffline(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Online]
        ,
        stateToSet: ChairStates.Offline
      }
    )
  }


  async updateChairStateToReserved(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Online,ChairStates.TemporarilyDefective,ChairStates.Opened]
        ,
        stateToSet: ChairStates.Reserved
      }
    )
  }

  async updateChairStateToOpened(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Reserved]
        ,
        stateToSet: ChairStates.Opened
      }
    )
  }

  async updateChairStateToDefect(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Online,ChairStates.TemporarilyDefective]
        ,
        stateToSet: ChairStates.Defective
      }
    )
  }

  async updateChairStateToTemporarilyDefective(id:string){
    return await this.updateChairState(
      id,
      {
        acceptedStates:[ChairStates.Reserved]
        ,
        stateToSet: ChairStates.TemporarilyDefective
      }
    )
  }
  
}
