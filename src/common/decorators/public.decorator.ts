import { SetMetadata } from '@nestjs/common';
import { MetaDataConstants } from '../constants';

export const Public = () => SetMetadata(MetaDataConstants.PUBLIC, true);
