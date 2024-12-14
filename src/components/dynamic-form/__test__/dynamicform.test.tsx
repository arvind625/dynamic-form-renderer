import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DynamicForm } from "../DynamicForm";
import { FieldTypeEnum } from "../../../libs";

// Mock useGetFormData hook
jest.mock("../../../libs", () => ({
  ...jest.requireActual("../../../libs"),
  useGetFormData: jest.fn(),
}));

const mockedUseGetFormData = require("../../../libs").useGetFormData;

describe("DynamicForm Component", () => {
  const mockConfig = {
    fields: [
      { name: "username", label: "Username", type: FieldTypeEnum.TEXT },
      { name: "password", label: "Password", type: FieldTypeEnum.PASSWORD },
      {
        name: "gender",
        label: "Gender",
        type: FieldTypeEnum.RADIO,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ],
      },
      { name: "terms", label: "Accept Terms", type: FieldTypeEnum.CHECKBOX },
    ],
  };

  beforeEach(() => {
    mockedUseGetFormData.mockReturnValue({
      visibleFields: {
        username: true,
        password: true,
        gender: true,
        terms: true,
      },
      formData: { username: "", password: "", gender: "", terms: false },
      errors: {},
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn((e) => e.preventDefault()),
    });
  });

  it("renders form fields based on the config", () => {
    render(<DynamicForm config={mockConfig} />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Male")).toBeInTheDocument();
    expect(screen.getByLabelText("Female")).toBeInTheDocument();
    expect(screen.getByLabelText("Accept Terms")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const { handleInputChange } = mockedUseGetFormData();
    render(<DynamicForm config={mockConfig} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "JohnDoe" },
    });
    expect(handleInputChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.anything() })
    );

    fireEvent.click(screen.getByLabelText("Male"));
    expect(handleInputChange).toHaveBeenCalled();
  });

  it("handles checkbox interactions", () => {
    const { handleInputChange } = mockedUseGetFormData();
    render(<DynamicForm config={mockConfig} />);

    const checkbox = screen.getByLabelText("Accept Terms");
    fireEvent.click(checkbox);
    expect(handleInputChange).toHaveBeenCalled();
  });

  it("calls handleSubmit on form submission", () => {
    const { handleSubmit } = mockedUseGetFormData();
    render(<DynamicForm config={mockConfig} />);

    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("displays validation errors when present", () => {
    mockedUseGetFormData.mockReturnValueOnce({
      ...mockedUseGetFormData(),
      errors: { username: "Username is required" },
    });

    render(<DynamicForm config={mockConfig} />);

    expect(screen.getByText("Username is required")).toBeInTheDocument();
  });
});
