import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { EventType, websocketEvent } from "./events";
import { joy, redrawJoy } from "./joystick";
import "./App.css";

const defaultColor = "#efee69";
redrawJoy(defaultColor);

const numberOfColors = 20;
const colorScale = chroma
  .scale([
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#008000",
    "#0000ff",
    "#4b0082",
    "#ee82ee",
  ])
  .mode("hcl")
  .colors(numberOfColors);

const intervalMilliseconds = 30;
let interval: NodeJS.Timer | undefined = undefined;

const socket = new WebSocket("ws://127.0.0.1:9431");
socket.binaryType = "arraybuffer";

function App() {
  const [color, setColor] = useState(defaultColor);
  const [colorBytes, setColorBytes] = useState(
    Uint8Array.from([0xef, 0xee, 0x69]),
  );

  // on startup and any color change, send a connect event and regular update events
  useEffect(() => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const x = joy.GetX();
      const y = joy.GetY();
      if (
        x > 0.00000001 ||
        x < -0.00000001 ||
        y > 0.00000001 ||
        y < -0.00000001
      ) {
        let evt = {
          evt: "update" as EventType,
          player: colorBytes,
          data: { dx: x, dy: y },
        };
        // fireEvent(evt);
        websocketEvent(socket, evt);
      }
    }, intervalMilliseconds);
  }, [color, colorBytes]);

  const changeColor = (newColor: string) => {
    let evt = {
      evt: "changeColor" as EventType,
      player: colorBytes,
      data: {},
    };
    // fireEvent(evt);
    websocketEvent(socket, evt);
    redrawJoy(newColor);
    setColor(newColor);
    setColorBytes(Uint8Array.from(Buffer.from(newColor, "hex")));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="color-picker">
          {colorScale.map((value, index) => (
            <div
              key={index}
              className="color"
              style={{
                backgroundColor: value,
                boxShadow: `0 0 15px 2px ${value}`,
              }}
              onClick={() => changeColor(value)}
            />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
