import logo from "./logo.svg";
import "./App.css";

type KeyValue = {
  name: string;
  value: number;
};

const loadValues = async () => {
  const response = await fetch("/api/values");
  const { values } = await response.json();
  return values;
};

const updateValue = async (name: string, value: number) =>
  await fetch(`/api/values/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, value }),
  });

const updateValueDelta = async (name: string, delta: number) => {
  const data: KeyValue[] = await loadValues();
  const oldDatum = data.find((datum) => datum.name === name);
  if (oldDatum) await updateValue(name, oldDatum.value + delta);
  else console.log("cannot update missing key:", name);
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => updateValueDelta("y", 1)}>Up</button>
        <button onClick={() => updateValueDelta("y", -1)}>Down</button>
      </header>
    </div>
  );
}

export default App;
