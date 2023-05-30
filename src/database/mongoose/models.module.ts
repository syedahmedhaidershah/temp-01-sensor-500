import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as schemasAndModels from './schemas';
// {
//   Sensor,
//   SensorSchema,
//   Test,
//   TestSchema,
// }

const toImport = [
  'Test',
  'Sensor',
]


const mongooseModuleToExport = MongooseModule
  .forFeature(
    toImport
      .map((entityName) => ({
        name: schemasAndModels[entityName].name,
        schema: schemasAndModels[`${entityName}Schema`]
      }))
  );

@Module({
  imports: [
    mongooseModuleToExport,
  ],
  exports: [
    mongooseModuleToExport,
  ],
})
export class ModelsModule { }
