import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { EventType, fireEvent, PlayerEvent } from "./events";
import { joy, redrawJoy } from "./joystick";
import { deepEqual } from "./util";
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

const intervalMilliseconds = 1000;
let interval: NodeJS.Timer | undefined = undefined;
let lastEvent: PlayerEvent = { evt: "connect", player: "", data: {} };

function App() {
  const [color, setColor] = useState(defaultColor);

  // on startup and any color change, send a connect event and regular update events
  useEffect(() => {
    fireEvent({
      evt: "connect",
      player: color,
      data: {},
    });

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const newUpdateEvent = {
        evt: "update" as EventType,
        player: color,
        data: { dx: joy.GetX(), dy: joy.GetY() },
      };

      // suppress noop events
      if (deepEqual(newUpdateEvent, lastEvent)) return;

      fireEvent(newUpdateEvent);
      lastEvent = newUpdateEvent;
    }, intervalMilliseconds);
  }, [color]);

  const changeColor = (newColor: string) => {
    fireEvent({
      evt: "disconnect",
      player: color,
      data: {},
    });
    redrawJoy(newColor);
    setColor(newColor);
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
