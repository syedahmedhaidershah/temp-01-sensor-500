/** Core dependencies */
import { Injectable } from '@nestjs/common';


/** Local dependencies and libraries */
import { MqttClientService } from 'src/common/services';


@Injectable()
export class MqttService {
    constructor(
        private readonly mqtt: MqttClientService
    ) {
    }

}
