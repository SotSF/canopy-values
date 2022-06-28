import chroma from "chroma-js";
import { useState } from "react";
import { EventType, sendEvent } from "./events";
import { joy, redrawJoy } from "./joystick";
import "./App.css";

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
// TODO start with random color
const defaultColor = "#efee69";
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

  const onColorChange = (newColor: string) => {
    sendEvent({
      event: EventType.ChangeColor,
      color,
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
              onClick={() => onColorChange(value)}
            />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
