interface PlayerEvent {
  evt: EventType;
  player: Uint8Array;
  data: Record<string, any>;
}

export enum EventType {
  Update = 1,
  ChangeColor,
  Fire,
}
/* Binary format
    00          < Event type
    00 00 00    < Player hex color
    00 00 00 00 < float data 0 (dx)
    00 00 00 00 < float data 1 (dy)
*/

export const fireEvent = async (event: PlayerEvent) =>
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

export const websocketEvent = async(socket: WebSocket, event: PlayerEvent) =>
{
  let byteBuffer = new Uint8Array(12);
  byteBuffer[0] = event.evt.valueOf();
  byteBuffer[1] = event.player[0];
  byteBuffer[2] = event.player[1];
  byteBuffer[3] = event.player[2];
  let floatData = new Uint8Array(new Float32Array([event.data['dx'], event.data['dy']]).buffer)
  for (let i = 0; i < 8; i++){
    byteBuffer[i+4] = floatData[i];
  }
  socket.send(byteBuffer.buffer);
}
