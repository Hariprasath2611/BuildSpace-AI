import express from 'express';
import { IFCParser } from './bim/IFCParser';
import { TwinStateSync } from './twin/TwinStateSync';

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'digital-twin-api' });
});

// Expose parsed BIM properties for frontend React Three Fiber
app.get('/api/bim/:modelId/properties', async (req, res) => {
  const props = await IFCParser.extractMetadata(req.params.modelId);
  res.json(props);
});

// Get Live Twin State (Fused IoT + BIM + Schedule)
app.get('/api/twin/:projectId/live-state', async (req, res) => {
  const state = await TwinStateSync.getLiveState(req.params.projectId);
  res.json(state);
});

app.listen(port, () => {
  console.log(`🏗️ Digital Twin API running on port ${port}`);
});
