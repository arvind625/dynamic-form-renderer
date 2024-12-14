import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const ColorField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <FieldLabel field={field} />
    <input
      type="color"
      id={field.name}
      name={field.name}
      value={(formData[field.name] as string) ?? "#4caf50"}
      onChange={handleInputChange}
    />
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
