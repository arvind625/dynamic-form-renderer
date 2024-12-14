import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const DateField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <FieldLabel field={field} />
    <input
      id={field.name}
      type={field.type}
      name={field.name}
      value={(formData[field.name] as string) || ""}
      onChange={handleInputChange}
      min={field.min}
      max={field.max}
    />
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
