"use client";

import { useEffect, useState } from "react";
import Select, { StylesConfig, Props as SelectProps } from "react-select";

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  icon?: string;
}

interface CustomSelectProps<T = string | number> {
  options: SelectOption<T>[];
  value?: T | T[];
  onChange: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
  error?: boolean;
  size?: "sm" | "md";
}

export function CustomSelect<T = string | number>({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  className = "",
  error = false,
  size = "md",
}: CustomSelectProps<T>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute selected option(s)
  const getSelectedOption = () => {
    if (isMulti && Array.isArray(value)) {
      return options.filter((opt) => value.includes(opt.value));
    }
    if (!isMulti && value !== undefined && value !== null) {
      return options.find((opt) => opt.value === value) || null;
    }
    return null;
  };

  const handleChange = (selected: any) => {
    if (isMulti) {
      const selectedArray = selected as SelectOption<T>[];
      onChange(selectedArray ? selectedArray.map((opt) => opt.value) : []);
    } else {
      const selectedOption = selected as SelectOption<T> | null;
      onChange(selectedOption ? selectedOption.value : null);
    }
  };

  const isSmall = size === "sm";

  const customStyles: StylesConfig<SelectOption<T>, boolean> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? "#f4f4f0" : "#ffffff",
      borderColor: error
        ? "#ba1a1a"
        : state.isFocused
        ? "#ff6b6b"
        : "#e3e2df",
      borderRadius: isSmall ? "0.75rem" : "1rem",
      padding: isSmall ? "0 4px" : "2px 6px",
      minHeight: isSmall ? "38px" : "46px",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(255, 107, 107, 0.15)"
        : "none",
      transition: "all 0.2s ease",
      fontFamily: "var(--font-headline), sans-serif",
      fontSize: isSmall ? "0.8125rem" : "0.875rem",
      fontWeight: 500,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      "&:hover": {
        borderColor: error
          ? "#ba1a1a"
          : state.isFocused
          ? "#ff6b6b"
          : "#8c706f",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: isSmall ? "0 4px" : "2px 6px",
      gap: "4px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#8c706f",
      fontFamily: "var(--font-headline), sans-serif",
      fontSize: isSmall ? "0.8125rem" : "0.875rem",
      fontWeight: 400,
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1b1c1a",
      fontWeight: 600,
      fontFamily: "var(--font-headline), sans-serif",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(255, 107, 107, 0.12)",
      borderRadius: "0.5rem",
      padding: "1px 4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#ae2f34",
      fontWeight: 700,
      fontSize: "0.75rem",
      fontFamily: "var(--font-headline), sans-serif",
      padding: "2px 6px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#ae2f34",
      borderRadius: "0.375rem",
      "&:hover": {
        backgroundColor: "#ffdad6",
        color: "#ba1a1a",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "1rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e3e2df",
      padding: "6px",
      zIndex: 99,
      backgroundColor: "#ffffff",
      overflow: "hidden",
    }),
    menuList: (base) => ({
      ...base,
      padding: "2px",
      maxHeight: "220px",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "0.5rem",
      padding: isSmall ? "6px 10px" : "8px 12px",
      fontFamily: "var(--font-headline), sans-serif",
      fontSize: isSmall ? "0.8125rem" : "0.875rem",
      fontWeight: state.isSelected ? 700 : 500,
      backgroundColor: state.isSelected
        ? "#ff6b6b"
        : state.isFocused
        ? "rgba(255, 107, 107, 0.08)"
        : "transparent",
      color: state.isSelected ? "#ffffff" : "#1b1c1a",
      cursor: "pointer",
      transition: "background-color 0.15s ease",
      "&:active": {
        backgroundColor: "#ff6b6b",
        color: "#ffffff",
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#ff6b6b" : "#8c706f",
      padding: isSmall ? "2px 4px" : "4px 8px",
      "&:hover": {
        color: "#ff6b6b",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#8c706f",
      padding: isSmall ? "2px 4px" : "4px 8px",
      "&:hover": {
        color: "#ba1a1a",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  if (!mounted) {
    return (
      <div
        className={`w-full ${
          isSmall ? "h-[38px]" : "h-[46px]"
        } bg-[#f4f4f0] rounded-${
          isSmall ? "xl" : "2xl"
        } animate-pulse border border-[#e3e2df] ${className}`}
      />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Select
        instanceId={`select-${Math.random().toString(36).substr(2, 9)}`}
        options={options}
        value={getSelectedOption()}
        onChange={handleChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={customStyles as any}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
      />
    </div>
  );
}
