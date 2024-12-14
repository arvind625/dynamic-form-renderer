import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Errors,
  Field,
  FormData,
  FormConfig,
  VisibleFields,
  FieldLabel,
  FieldTypeEnum,
} from "../../libs";

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
      const initialFormData: FormData = {};
      const initialVisibility: VisibleFields = {};
      config.fields.forEach((field) => {
        if (field.value) {
          initialFormData[field.name] = field.value;
        }
        initialVisibility[field.name] = true;
      });
      setVisibleFields(initialVisibility);
      setFormData(initialFormData);
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
    console.log("event", event.target.value);
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
      case FieldTypeEnum.TEXT:
      case FieldTypeEnum.PASSWORD:
      case FieldTypeEnum.EMAIL:
      case FieldTypeEnum.NUMBER:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <input
              id={field.name}
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
      case FieldTypeEnum.TEXT_AREA:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <textarea
              id={field.name}
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
      case FieldTypeEnum.SELECT:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <select
              id={field.name}
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
      case FieldTypeEnum.CHECKBOX:
        return (
          <div key={field.name} className="flex_col gap_6">
            <div key={field.name} className="flex_row gap_6">
              <input
                id={field.name}
                type="checkbox"
                name={field.name}
                checked={(formData[field.name] as boolean) || false}
                onChange={handleInputChange}
              />
              <FieldLabel field={field} />
            </div>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case FieldTypeEnum.RADIO:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            {field.options?.map((option) => (
              <div key={option.value} className="flex_row">
                <input
                  id={field.name}
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={(formData[field.name] as string) === option.value}
                  onChange={handleInputChange}
                />
                <label htmlFor={field.name}>{option.label}</label>
              </div>
            ))}
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case FieldTypeEnum.FILE:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <input
              type="file"
              id={field.name}
              name={field.name}
              onChange={handleInputChange}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
            {formData[field.name] &&
              typeof formData[field.name] !== "string" && (
                <p>Selected File: {(formData[field.name] as File)?.name}</p>
              )}
          </div>
        );
      case FieldTypeEnum.COLOR:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <input
              type="color"
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) ?? "#4caf50"}
              onChange={handleInputChange}
            />
            <p>{`Selected Color: ${formData[field.name]}`}</p>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case FieldTypeEnum.DATE:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <input
              id={field.name}
              type="date"
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              min={field.min}
              max={field.max}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case FieldTypeEnum.DATE_TIME_LOCAL:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel field={field} />
            <input
              type="datetime-local"
              name={field.name}
              id={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={handleInputChange}
              min={field.min}
              max={field.max}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
      case FieldTypeEnum.RANGE:
        return (
          <div key={field.name} className="flex_col gap_6">
            <FieldLabel
              field={field}
              value={`${field.label}: ${
                (formData[field.name] as number) || field.min
              }`}
            />
            <input
              id={field.name}
              type="range"
              name={field.name}
              min={field.min}
              max={field.max}
              step={field.step}
              value={(formData[field.name] as number) || field.min}
              onChange={handleInputChange}
            />
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
    <form onSubmit={handleSubmit} className={"form-container"}>
      {config?.fields?.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
};
