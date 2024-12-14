import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const RadioField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
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
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
