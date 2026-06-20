export class SmartHelmetHandler {
  static process(payload: any) {
    const { workerId, lat, lng, isFallDetected, sosTriggered } = payload;

    if (sosTriggered || isFallDetected) {
      console.warn(`[EMERGENCY] Worker ${workerId} triggered SOS/Fall at ${lat}, ${lng}!`);
      // In production: Publish this to the Realtime Socket.io Gateway via Redis Pub/Sub
      // to alert the Safety Officer Dashboard instantly.
    } else {
      // Normal location tracking update
      // Update Digital Twin worker location state
      console.log(`Worker ${workerId} location updated.`);
    }
  }
}
