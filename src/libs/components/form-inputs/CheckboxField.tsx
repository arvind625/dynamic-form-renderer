import { FieldLabel } from "../field-label";
import { FormFieldProps } from "./interface";

export const CheckboxField: React.FC<FormFieldProps> = ({
  field,
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="flex_col gap_6">
    <div className="flex_row gap_6">
      <input
        id={field.name}
        type="checkbox"
        name={field.name}
        checked={(formData[field.name] as boolean) || false}
        onChange={handleInputChange}
      />
      <FieldLabel field={field} />
    </div>
    {errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
