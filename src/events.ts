export const enum EventType {
  Update = 1,
  ChangeColor,
  Fire,
}

export type PlayerEvent =
  | {
      event: EventType.Update;
      dx: number;
      dy: number;
    }
  | {
      event: EventType.ChangeColor;
      color: string;
    }
  | {
      event: EventType.Fire;
    };

const websocket = new WebSocket("ws://127.0.0.1:9431");
websocket.binaryType = "arraybuffer";

/*
  Binary format

  EventType.Fire:
    0x00                < Event type

  EventType.ChangeColor:
    0x00                < Event type
    0x00 0x00 0x00      < Player hex color

  EventType.Update:
    0x00                < Event type
    0x00 0x00 0x00 0x00 < float data 0 (dx)
    0x00 0x00 0x00 0x00 < float data 1 (dy)
*/
export const sendEvent = async (playerEvent: PlayerEvent) => {
  const byteBuffer = new Uint8Array(9);
  byteBuffer[0] = playerEvent.event;

  switch (playerEvent.event) {
    case EventType.ChangeColor:
      const colorBytes = Uint8Array.from(Buffer.from(playerEvent.color, "hex"));
      byteBuffer[1] = colorBytes[0];
      byteBuffer[2] = colorBytes[1];
      byteBuffer[3] = colorBytes[2];
      break;
    case EventType.Update:
      let floatData = new Uint8Array(
        new Float32Array([playerEvent.dx, playerEvent.dy]).buffer,
      );
      for (let i = 0; i < 8; i++) {
        byteBuffer[i + 1] = floatData[i];
      }
  }

  websocket.send(byteBuffer.buffer);
};
