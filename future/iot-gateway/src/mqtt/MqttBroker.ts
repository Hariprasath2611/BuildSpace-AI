import mqtt, { MqttClient } from 'mqtt';
import { SmartHelmetHandler } from '../sensors/SmartHelmetHandler';

export class MqttBroker {
  private static client: MqttClient;

  static initialize(brokerUrl: string) {
    this.client = mqtt.connect(brokerUrl);

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      this.client.subscribe('telemetry/helmet/#');
      this.client.subscribe('telemetry/concrete/#');
    });

    this.client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (topic.startsWith('telemetry/helmet')) {
          SmartHelmetHandler.process(payload);
        } else if (topic.startsWith('telemetry/concrete')) {
          // Process concrete curing sensor (temperature/humidity)
        }
      } catch (err) {
        console.error('Failed to parse MQTT message on topic', topic);
      }
    });
  }

  static publish(topic: string, message: object) {
    if (this.client) {
      this.client.publish(topic, JSON.stringify(message));
    }
  }
}
