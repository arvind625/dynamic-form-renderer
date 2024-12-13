// src/components/DynamicForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Option {
  label: string;
  value: string;
}

interface Conditional {
  field: string;
  value: string;
}

interface Field {
  label: string;
  name: string;
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  conditional?: Conditional;
  pattern?: string;
  patternError?: string;
}

interface FormConfig {
  fields: Field[];
}

interface FormData {
  [key: string]: string | boolean;
}

interface Errors {
  [key: string]: string;
}

interface VisibleFields {
  [key: string]: boolean;
}

interface DynamicFormProps {
  config: FormConfig;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({});
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    // Initially set all fields to visible
    if (config?.fields) {
      const initialVisibility: VisibleFields = {};
      config.fields.forEach((field) => {
        initialVisibility[field.name] = true;
      });
      setVisibleFields(initialVisibility);
    }
  }, [config]);

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement &
      HTMLSelectElement &
      HTMLTextAreaElement;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearError(name);
    updateVisibleFields(config, {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateVisibleFields = (config: FormConfig, formData: FormData) => {
    if (!config?.fields) return;

    const updatedVisibility: VisibleFields = { ...visibleFields };

    config.fields.forEach((field) => {
      if (field.conditional) {
        const condition = field.conditional;
        const conditionFieldValue = formData?.[condition.field];
        if (conditionFieldValue !== condition.value) {
          updatedVisibility[field.name] = false;
        } else {
          updatedVisibility[field.name] = true;
        }
      } else {
        updatedVisibility[field.name] = true;
      }
    });
    setVisibleFields(updatedVisibility);
  };

  const clearError = (name: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Errors = {};
    if (config && config.fields) {
      config.fields.forEach((field) => {
        if (
          field.required &&
          (!formData[field.name] || formData[field.name] === "")
        ) {
          newErrors[field.name] = `${field.label} is required`;
        }

        if (field.type === "email" && formData[field.name]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[field.name] as string)) {
            newErrors[field.name] = `Invalid email format`;
          }
        }

        if (field.pattern && formData[field.name]) {
          const regex = new RegExp(field.pattern);
          if (!regex.test(formData[field.name] as string)) {
            newErrors[field.name] = field.patternError || "Invalid format";
          }
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form Data:", formData);
    alert(JSON.stringify(formData, null, 2));
    setFormData({});
    if (config?.fields) {
      const initialVisibility: VisibleFields = {};
      config.fields.forEach((field) => {
        initialVisibility[field.name] = true;
      });
      setVisibleFields(initialVisibility);
    }
  };

  const renderField = (field: Field) => {
    if (!visibleFields[field.name]) {
      return null;
    }
    switch (field.type) {
      case "text":
      case "password":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "email":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="email"
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "number":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "textarea":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <textarea
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "select":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <select
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name}>
            <label>
              <input
                type="checkbox"
                name={field.name}
                checked={(formData[field.name] as boolean) || false}
                onChange={handleInputChange}
              />
              {field.label}
            </label>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case "radio":
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            {field.options?.map((option) => (
              <div key={option.value}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={(formData[field.name] as string) === option.value}
                  onChange={handleInputChange}
                />
                <label>{option.label}</label>
              </div>
            ))}
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {config?.fields?.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
};
