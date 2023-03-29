/** Core dependencies */
import { Injectable } from '@nestjs/common';


/** Third party dependencies */
import * as MQTT from 'async-mqtt';


/** Local configurations */
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';


const {
    MQTT_HOST: mqttHost,
    MQTT_USERNAME: mqttUsername,
    MQTT_PASSWORD: mqttPassword,
} = process.env as EnvironmentVariables;


@Injectable()
export class MqttClientService {
    static client: MQTT.AsyncMqttClient;

    constructor() {
        try {
            MqttClientService.client = MQTT.connect(
                mqttHost,
                {
                    username: mqttUsername,
                    password: mqttPassword,
                }
            );
        } catch (exc) {
            console.log(exc);
        }
    }

    asyncConnection = async (): Promise<MQTT.AsyncMqttClient> => {
        if (MqttClientService.client)
            return MqttClientService.client;

        return await new Promise((resolve, reject) => {
            MqttClientService.client.on(
                'connect',
                () => { resolve(MqttClientService.client) }
            );

            MqttClientService.client.on('error', reject);
        });
    }


}
