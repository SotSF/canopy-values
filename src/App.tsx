import chroma from "chroma-js";
import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { Button, EventType, sendEvent } from "./modules/events";
import { joyL, joyR, redrawJoys } from "./modules/joystick";
import { useDeviceOrientation } from "./modules/deviceOrientation";
import { throttle } from "lodash";
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
redrawJoys(defaultColor);

// Send update events with joystick positions at a regular interval
const eventThrottleMs = 50;
setInterval(() => {
  const lx = joyL.GetX();
  const ly = joyL.GetY();
  const rx = joyR.GetX();
  const ry = joyR.GetY();
  if ([lx, ly, rx, ry].some((n) => n > 0.00001 || n < -0.00001))
    sendEvent({
      event: EventType.Update,
      lx,
      ly,
      rx,
      ry,
    });
}, eventThrottleMs);

const sendChangeColorEvent = throttle(
  (color: string) =>
    sendEvent({
      event: EventType.ChangeColor,
      color,
    }),
  500,
);

const sendButtonPressEvent = throttle(
  (button: Button) =>
    sendEvent({
      event: EventType.Press,
      button,
    }),
  eventThrottleMs,
);

function App() {
  const [color, setColor] = useState(defaultColor);
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 } as HSVA);

  const { orientation, requestAccess, error } = useDeviceOrientation();

  const onColorChange = (newColor: string) => {
    sendChangeColorEvent(newColor);
    redrawJoys(newColor);
    setColor(newColor);
  };

  const onHsvaChange = (newColor: { hex: string; hsva: HSVA }) => {
    setHsva({ ...hsva, ...newColor.hsva });
    onColorChange(newColor.hex);
  };

  return (
    <div className="App">
      <Wheel width={175} height={175} color={hsva} onChange={onHsvaChange} />
      <div className="color-container">
        {colorScale.map((value, index) => (
          <div
            key={index}
            className="color"
            tabIndex={0}
            style={{
              backgroundColor: value,
              boxShadow: `0 0 15px ${
                value === color ? "10px" : "2px"
              } ${value}`,
            }}
            onClick={() => onColorChange(value)}
          />
        ))}
      </div>
      <div className="button-wrapper">
        <div className="button-container">
          <button
            className="button"
            onTouchStart={() => {
              sendButtonPressEvent(Button.L);
            }}
            onClick={() =>
              !("ontouchstart" in document.documentElement) &&
              sendButtonPressEvent(Button.L)
            }
          >
            L
          </button>
          <button className="button" onClick={() => requestAccess()}>
            Request access
          </button>
          <div>
            <code>
              {orientation?.alpha?.toFixed(2) || error?.name || "missing"}
            </code>
          </div>
          <button
            className="button"
            onTouchStart={() => sendButtonPressEvent(Button.R)}
            onClick={() =>
              !("ontouchstart" in document.documentElement) &&
              sendButtonPressEvent(Button.R)
            }
          >
            R
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
