import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const RangeField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <FieldLabel
      field={field}
      value={`${field.label}: ${(formData[field.name] as number) || field.min}`}
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
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
