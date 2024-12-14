import { Field } from "../interface";

interface FieldLabelProps {
  field: Field;
  value?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ value, field }) => (
  <label
    htmlFor={field.name}
    className={`label ${field.required ? "required" : ""}`}
  >
    {value || field.label}
  </label>
);
