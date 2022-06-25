import { useEffect, useState } from "react";
import "./App.css";

type KeyValue = {
  name: string;
  value: number;
};

let dataStore: Record<string, number> = {};
const fetchValues = async () => {
  const response = await fetch("/api/values");
  const values = (await response.json()).values as KeyValue[];
  for (const { name, value } of values) {
    dataStore[name] = value;
  }
  return dataStore;
};

const updateValue = async (name: string, value: number) => {
  dataStore[name] = value;
  await fetch(`/api/values/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, value }),
  });
};

const updateValueDelta = (name: string, delta: number) =>
  updateValue(name, dataStore[name] + delta);

function App() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  // Initialize x, y state with true values
  const initializeData = async () => {
    await fetchValues();
    setX(dataStore.x);
    setY(dataStore.y);
  };
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <svg width="100%" height={500} viewBox={`0 0 100 100`}>
          <g>
            <circle r={5} cx={x} cy={y} fill="blue" />
          </g>
        </svg>
        <button
          onClick={() => {
            setY(dataStore.y - 10);
            updateValueDelta("y", -10);
          }}
        >
          Up
        </button>
        <button
          onClick={() => {
            setY(dataStore.y + 10);
            updateValueDelta("y", 10);
          }}
        >
          Down
        </button>
      </header>
    </div>
  );
}

export default App;
