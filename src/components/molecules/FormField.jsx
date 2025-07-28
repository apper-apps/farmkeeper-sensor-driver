import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options = [], 
  placeholder,
  required = false,
  className,
  error,
  ...props 
}) => {
  const fieldId = `field-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={fieldId} className={required ? "after:content-['*'] after:text-error after:ml-1" : ""}>
          {label}
        </Label>
      )}
      {type === "select" ? (
        <Select
          id={fieldId}
          value={value}
          onChange={onChange}
          className={error ? "border-error focus:ring-error/50 focus:border-error" : ""}
          {...props}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-error focus:ring-error/50 focus:border-error" : ""
          )}
          {...props}
        />
      ) : (
        <Input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? "border-error focus:ring-error/50 focus:border-error" : ""}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;