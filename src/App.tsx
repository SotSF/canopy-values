import chroma from "chroma-js";
import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { EventType, sendEvent } from "./events";
import { joy, redrawJoy } from "./joystick";
import { throttle } from "./util";
import "./App.css";

type HSVA = { h: number; s: number; v: number; a: number };

const numberOfColors = 8;
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

const defaultColor = colorScale[Math.floor(Math.random() * colorScale.length)];
redrawJoy(defaultColor);

// Send update events with joystick position at a regular interval
const intervalMilliseconds = 30;
setInterval(() => {
  const dx = joy.GetX();
  const dy = joy.GetY();
  if (
    dx > 0.00000001 ||
    dx < -0.00000001 ||
    dy > 0.00000001 ||
    dy < -0.00000001
  )
    sendEvent({
      event: EventType.Update,
      dx,
      dy,
    });
}, intervalMilliseconds);

function App() {
  const [color, setColor] = useState(defaultColor);
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 } as HSVA);

  const onColorChange = (newColor: string) => {
    sendEvent({
      event: EventType.ChangeColor,
      color,
    });
    redrawJoy(newColor);
    setColor(newColor);
  };

  const onHsvaChange = (newColor: { hex: string; hsva: HSVA }) => {
    setHsva({ ...hsva, ...newColor.hsva });
    onColorChange(newColor.hex);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Wheel
          width={175}
          height={175}
          color={hsva}
          onChange={(newColor) =>
            throttle(() => onHsvaChange(newColor), intervalMilliseconds)
          }
        />
        <div className="color-picker">
          {colorScale.map((value, index) => (
            <div
              key={index}
              className="color"
              style={{
                backgroundColor: value,
                boxShadow: `0 0 15px 2px ${value}`,
              }}
              onClick={() => onColorChange(value)}
            />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
