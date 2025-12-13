import { ChangeButton } from "./components/change-button";
import { Count } from "./components/count";
import { CountProvider } from "./CountContext";
import "./index.css";

export function App() {
  return (
    <div className="app">
      <CountProvider>
        <ChangeButton method="increment" />
        <Count />
        <ChangeButton method="decrement" />
      </CountProvider>
    </div>
  );
}

export default App;
