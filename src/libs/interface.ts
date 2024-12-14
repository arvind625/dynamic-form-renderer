interface Option {
  label: string;
  value: string;
}

interface Conditional {
  field: string;
  value: string;
}

export interface Field {
  label: string;
  name: string;
  type: FieldTypeEnum;
  value?: string | boolean | number | File; // Added value
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  conditional?: Conditional;
  pattern?: string;
  patternError?: string;
  min?: string;
  max?: string;
  step?: string;
}

export enum FieldTypeEnum {
  TEXT = "text",
  PASSWORD = "password",
  EMAIL = "email",
  NUMBER = "number",
  TEXT_AREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  FILE = "file",
  COLOR = "color",
  DATE = "date",
  DATE_TIME_LOCAL = "datetime-local",
  RANGE = "range",
}

export interface FormConfig {
  fields: Field[];
}

export interface FormData {
  [key: string]: string | boolean | number | File;
}

export interface Errors {
  [key: string]: string;
}

export interface VisibleFields {
  [key: string]: boolean;
}
