import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Errors, FormConfig, FormData, VisibleFields } from "../interface";

interface Params {
  config: FormConfig;
}

export const useGetFormData = ({ config }: Params) => {
  const [formData, setFormData] = useState<FormData>({});
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({});
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    // Initially set all fields to visible
    if (config?.fields) {
      const initialFormData: FormData = {};
      const initialVisibility: VisibleFields = {};
      config.fields.forEach((field) => {
        if (field.value) {
          initialFormData[field.name] = field.value;
        }
        initialVisibility[field.name] = true;
      });
      setVisibleFields(initialVisibility);
      setFormData(initialFormData);
    }
  }, [config]);

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement &
      HTMLSelectElement &
      HTMLTextAreaElement;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearError(name);
    updateVisibleFields(config, {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateVisibleFields = (config: FormConfig, formData: FormData) => {
    if (!config?.fields) return;

    const updatedVisibility: VisibleFields = { ...visibleFields };

    config.fields.forEach((field) => {
      if (field.conditional) {
        const condition = field.conditional;
        const conditionFieldValue = formData?.[condition.field];
        if (conditionFieldValue !== condition.value) {
          updatedVisibility[field.name] = false;
        } else {
          updatedVisibility[field.name] = true;
        }
      } else {
        updatedVisibility[field.name] = true;
      }
    });
    setVisibleFields(updatedVisibility);
  };

  const clearError = (name: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Errors = {};
    if (config && config.fields) {
      config.fields.forEach((field) => {
        if (
          field.required &&
          (!formData[field.name] || formData[field.name] === "")
        ) {
          newErrors[field.name] = `${field.label} is required`;
        }

        if (field.type === "email" && formData[field.name]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[field.name] as string)) {
            newErrors[field.name] = `Invalid email format`;
          }
        }

        if (field.pattern && formData[field.name]) {
          const regex = new RegExp(field.pattern);
          if (!regex.test(formData[field.name] as string)) {
            newErrors[field.name] = field.patternError || "Invalid format";
          }
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert(JSON.stringify(formData, null, 2));
    setFormData({});
    if (config?.fields) {
      const initialVisibility: VisibleFields = {};
      config.fields.forEach((field) => {
        initialVisibility[field.name] = true;
      });
      setVisibleFields(initialVisibility);
    }
  };

  return {
    handleInputChange,
    handleSubmit,
    errors,
    visibleFields,
    formData,
  };
};
