export const enum EventType {
  Update = 1,
  ChangeColor,
  Press,
  Gyro,
}

export const enum Button {
  L = 1,
  R,
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
      event: EventType.Press;
      button: Button;
    }
  | {
      event: EventType.Gyro;
      alpha: number;
      beta: number;
      gamma: number;
    };

const hexStringToIntArray = (hexString: string) =>
  Uint8Array.from(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

const { REACT_APP_WEBSOCKET_HOST, REACT_APP_WEBSOCKET_PORT } = process.env;
const websocket = new WebSocket(
  `ws://${REACT_APP_WEBSOCKET_HOST}:${REACT_APP_WEBSOCKET_PORT}`,
);
websocket.binaryType = "arraybuffer";

/*
  Binary format

  EventType.Press:
    0x00                < Event type
    0x00                < Button id

  EventType.ChangeColor:
    0x00                < Event type
    0x00 0x00 0x00      < Player hex color

  EventType.Update:
    0x00                < Event type
    0x00 0x00 0x00 0x00 < float data 0 (lx)
    0x00 0x00 0x00 0x00 < float data 1 (ly)
    0x00 0x00 0x00 0x00 < float data 2 (rx)
    0x00 0x00 0x00 0x00 < float data 3 (ry)

  EventType.Gyro:
    0x00                < Event type
    0x00 0x00 0x00 0x00 < float data 0 (alpha)
    0x00 0x00 0x00 0x00 < float data 1 (beta)
    0x00 0x00 0x00 0x00 < float data 2 (gamma)
*/
export const sendEvent = async (playerEvent: PlayerEvent) => {
  const byteBuffer = new Uint8Array(17);
  byteBuffer[0] = playerEvent.event;

  let floatData: Uint8Array;
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
      floatData = new Uint8Array(new Float32Array([lx, ly, rx, ry]).buffer);
      for (let i = 0; i < 16; i++) {
        byteBuffer[i + 1] = floatData[i];
      }
      break;
    case EventType.Press:
      byteBuffer[1] = playerEvent.button;
      break;
    case EventType.Gyro:
      const { alpha, beta, gamma } = playerEvent;
      floatData = new Uint8Array(new Float32Array([alpha, beta, gamma]).buffer);
      for (let i = 0; i < 12; i++) {
        byteBuffer[i + 1] = floatData[i];
      }
  }

  websocket.send(byteBuffer.buffer);
};
