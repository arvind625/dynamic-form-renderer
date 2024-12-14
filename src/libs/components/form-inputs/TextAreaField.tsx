import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const TextAreaField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <FieldLabel field={field} />
    <textarea
      id={field.name}
      name={field.name}
      value={(formData[field.name] as string) || ""}
      onChange={handleInputChange}
      placeholder={field.placeholder}
    />
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
