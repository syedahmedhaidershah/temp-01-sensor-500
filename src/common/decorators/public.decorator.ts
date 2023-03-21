import { SetMetadata } from '@nestjs/common';
import { Constants } from '../constants';

export const Public = () => SetMetadata(Constants.MetaData.PUBLIC, true);
