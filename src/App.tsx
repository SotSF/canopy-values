import logo from "./logo.svg";
import "./App.css";

function App() {
  const loadValues = async () => {
    const response = await fetch("/api/values");
    console.log(JSON.stringify(await response.json()));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={loadValues}>Test</button>
      </header>
    </div>
  );
}

export default App;
