// src/App.tsx
import React, { useState, ChangeEvent } from "react";
import { DynamicForm } from "./components";
import "./App.css";
import mockJson from "./components/dynamic-form/mock.json";

interface FormConfig {
  fields: any[];
}

function App() {
  const [jsonConfig, setJsonConfig] = useState<string>(
    JSON.stringify(mockJson, null, 2)
  );
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
  console.log("jsonConfig => ", jsonConfig);

  return (
    <div className="App">
      <h1 className="header">Dynamic Form Renderer</h1>
      <div className="main-container">
        <section className="flex_col flex_1 json-container">
          <textarea
            className="flex_1"
            placeholder="Paste your JSON config here..."
            value={jsonConfig}
            onChange={handleJsonChange}
          />
          <button onClick={handleLoadConfig}>Load Config</button>
          {error && <div className="error">{error}</div>}
        </section>
        <section className="right-section">
          {config ? (
            <DynamicForm config={config} />
          ) : (
            <div className="empty_field"> No field to render</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
