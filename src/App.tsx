import "./App.css";
import { DynamicForm } from "./components";
import { useGetJsonConfig } from "./libs/hooks/use-get-json-config";

function App() {
  const { jsonConfig, config, error, handleJsonChange, handleLoadConfig } =
    useGetJsonConfig();

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
