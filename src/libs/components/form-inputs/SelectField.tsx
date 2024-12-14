import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const SelectField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
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
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
