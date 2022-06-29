export const enum EventType {
  Update = 1,
  ChangeColor,
  Fire,
}

export type PlayerEvent =
  | {
      event: EventType.Update;
      lx: number;
      ly: number;
      rx: number;
      ry: number;
    }
  | {
      event: EventType.ChangeColor;
      color: string;
    }
  | {
      event: EventType.Fire;
    };

const hexStringToIntArray = (hexString: string) =>
  Uint8Array.from(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

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
    0x00 0x00 0x00 0x00 < float data 0 (lx)
    0x00 0x00 0x00 0x00 < float data 1 (ly)
    0x00 0x00 0x00 0x00 < float data 2 (rx)
    0x00 0x00 0x00 0x00 < float data 3 (ry)
*/
export const sendEvent = async (playerEvent: PlayerEvent) => {
  const byteBuffer = new Uint8Array(17);
  byteBuffer[0] = playerEvent.event;

  switch (playerEvent.event) {
    case EventType.ChangeColor:
      const colorBytes = hexStringToIntArray(
        playerEvent.color.replace("#", ""),
      );
      byteBuffer[1] = colorBytes[0];
      byteBuffer[2] = colorBytes[1];
      byteBuffer[3] = colorBytes[2];
      break;
    case EventType.Update:
      const { lx, ly, rx, ry } = playerEvent;
      const floatData = new Uint8Array(
        new Float32Array([lx, ly, rx, ry]).buffer,
      );
      for (let i = 0; i < 16; i++) {
        byteBuffer[i + 1] = floatData[i];
      }
  }

  websocket.send(byteBuffer.buffer);
};
