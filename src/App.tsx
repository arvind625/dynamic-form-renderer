// src/App.tsx
import React, { useState, ChangeEvent } from "react";
import { DynamicForm } from "./components";
import "./App.css";

interface FormConfig {
  fields: any[];
}

function App() {
  const [jsonConfig, setJsonConfig] = useState<string>("");
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonConfig(event.target.value);
    setError(null);
  };

  const handleLoadConfig = () => {
    try {
      const parsedConfig: FormConfig = JSON.parse(jsonConfig);
      setConfig(parsedConfig);
      setError(null);
    } catch (e: any) {
      setError("Invalid JSON");
      setConfig(null);
    }
  };

  return (
    <div className="App">
      <h1>Dynamic Form Renderer</h1>
      <textarea
        rows={10}
        cols={80}
        placeholder="Paste your JSON config here..."
        value={jsonConfig}
        onChange={handleJsonChange}
      />
      <br />
      <button onClick={handleLoadConfig}>Load Config</button>
      {error && <div className="error">{error}</div>}
      {config && <DynamicForm config={config} />}
    </div>
  );
}

export default App;
