import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const FileField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <FieldLabel field={field} />
    <input
      type="file"
      id={field.name}
      name={field.name}
      onChange={handleInputChange}
    />
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
    {formData[field.name] && typeof formData[field.name] !== "string" && (
      <p>Selected File: {(formData[field.name] as File)?.name}</p>
    )}
  </div>
);
