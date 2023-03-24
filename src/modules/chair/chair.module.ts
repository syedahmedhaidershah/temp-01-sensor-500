import { Module } from '@nestjs/common';
import { ChairService } from './chair.service';
import { ChairController } from './chair.controller';
import { ModelsModule } from 'src/database/mongoose';

@Module({
  controllers: [ChairController],
  providers: [ChairService],
  imports:[ModelsModule]
})
export class ChairModule {}
