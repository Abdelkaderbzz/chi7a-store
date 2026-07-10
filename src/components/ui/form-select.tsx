"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
}

/**
 * Radix Select that also submits its value inside a native <form> (server actions)
 * by mirroring the selection into a hidden input.
 */
export function FormSelect({ name, options, defaultValue, placeholder }: FormSelectProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
