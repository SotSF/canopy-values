import { useEffect, useState } from "react";
import { fireEvent } from "./events";
import "./App.css";

declare global {
  interface Window {
    JoyStick: any;
  }
}

interface Joy {
  GetX(): number;
  GetY(): number;
}

let joy: Joy | undefined = undefined;
if (!document.getElementById("joystick")) {
  joy = new window.JoyStick("joy");
}

const fireUpdate = async (color: string) =>
  fireEvent({
    evt: "update",
    player: color,
    data: { dx: joy?.GetX(), dy: joy?.GetY() },
  });

function App() {
  const [color] = useState("#ff0000");

  useEffect(() => {
    fireEvent({
      evt: "connect",
      player: color,
      data: {},
    });
    setInterval(() => {
      fireUpdate(color);
    }, 1000);
  }, [color]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => fireUpdate(color)}>Fire update event</button>
      </header>
    </div>
  );
}

export default App;
