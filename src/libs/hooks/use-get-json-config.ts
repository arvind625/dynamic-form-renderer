import { ChangeEvent, useState } from "react";
import mockJson from "../../components/dynamic-form/mock.json";
import { FormConfig } from "../interface";

export const useGetJsonConfig = () => {
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

  return {
    config,
    jsonConfig,
    error,
    handleLoadConfig,
    handleJsonChange,
  };
};
