import { Errors, Field, FormData } from "../../interface";

export interface FormFieldProps {
  field: Field;
  formData: FormData;
  errors: Errors;
  handleInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}
