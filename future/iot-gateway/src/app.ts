import express from 'express';
import { MqttBroker } from './mqtt/MqttBroker';

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'iot-gateway' });
});

app.listen(port, () => {
  console.log(`📡 IoT Gateway running on port ${port}`);
  
  // Initialize MQTT Client connecting to Mosquitto/EMQX
  MqttBroker.initialize('mqtt://localhost:1883');
});
