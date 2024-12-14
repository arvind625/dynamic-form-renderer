import React from "react";
import {
  CheckboxField,
  ColorField,
  DateField,
  Field,
  FieldTypeEnum,
  FileField,
  FormConfig,
  RadioField,
  RangeField,
  SelectField,
  TextAreaField,
  TextInputField,
  useGetFormData,
} from "../../libs";

interface DynamicFormProps {
  config: FormConfig;
}

const fieldComponents = {
  [FieldTypeEnum.TEXT]: TextInputField,
  [FieldTypeEnum.PASSWORD]: TextInputField,
  [FieldTypeEnum.EMAIL]: TextInputField,
  [FieldTypeEnum.NUMBER]: TextInputField,
  [FieldTypeEnum.TEXT_AREA]: TextAreaField,
  [FieldTypeEnum.SELECT]: SelectField,
  [FieldTypeEnum.CHECKBOX]: CheckboxField,
  [FieldTypeEnum.RADIO]: RadioField,
  [FieldTypeEnum.FILE]: FileField,
  [FieldTypeEnum.COLOR]: ColorField,
  [FieldTypeEnum.DATE]: DateField,
  [FieldTypeEnum.DATE_TIME_LOCAL]: DateField,
  [FieldTypeEnum.RANGE]: RangeField,
};

export const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
  const { visibleFields, formData, errors, handleInputChange, handleSubmit } =
    useGetFormData({
      config,
    });

  const renderField = (field: Field) => {
    if (!visibleFields[field.name]) {
      return null;
    }

    const FieldComponent = fieldComponents[field.type];
    return (
      FieldComponent && (
        <FieldComponent
          key={field.name}
          field={field}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className={"form-container"}>
      {config?.fields?.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
};
