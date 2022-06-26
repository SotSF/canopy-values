import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { fireEvent } from "./events";
import { joy, redrawJoy } from "./joystick";
import "./App.css";

const defaultColor = "#efee69";
redrawJoy(defaultColor);

const numberOfColors = 8;
const colorScale = chroma
  .scale(["red", "efee69", "green", "blue", "purple"])
  .mode("hcl")
  .colors(numberOfColors);

let interval: NodeJS.Timer | undefined = undefined;

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
    interval = setInterval(
      () =>
        fireEvent({
          evt: "update",
          player: color,
          data: { dx: joy.GetX(), dy: joy.GetY() },
        }),
      1000,
    );
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
