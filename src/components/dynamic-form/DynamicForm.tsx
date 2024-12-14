import React from "react";
import { Field, FieldLabel, FieldTypeEnum, FormConfig } from "../../libs";
import { useGetFormData } from "../../libs/hooks";

interface DynamicFormProps {
  config: FormConfig;
}
export const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
  const { visibleFields, formData, errors, handleInputChange, handleSubmit } =
    useGetFormData({
      config,
    });

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
