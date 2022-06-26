import { useEffect, useState } from "react";
import { fireEvent } from "./events";
import "./App.css";

declare global {
  interface Window {
    JoyStick: any;
  }
}

let joy;
if (!document.getElementById("joystick")) {
  joy = new window.JoyStick("joy", {}, () => console.log("testing"));
}

setInterval(() => {
  // TODO
}, 1000 / 30);

function App() {
  const [color, setColor] = useState("#ff0000");
  const fireUpdate = async () =>
    fireEvent({ evt: "update", player: color, data: {} });
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => fireUpdate()}>Fire update event</button>
      </header>
    </div>
  );
}

export default App;
