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
  client: MQTT.AsyncMqttClient;

  constructor() {
    try {
      this.client = MQTT.connect(mqttHost, {
        username: mqttUsername,
        password: mqttPassword,
      });
    } catch (exc) {
      console.log(exc);
    }
  }

  asyncConnection = async (): Promise<MQTT.AsyncMqttClient> => {
    if (this.client) return this.client;

    return await new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        resolve(this.client);
      });

      this.client.on('error', reject);
    });
  };
}
