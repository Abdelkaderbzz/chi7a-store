"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

/**
 * Radix Select that also submits its value inside a native <form> (server actions)
 * by mirroring the selection into a hidden input.
 */
export function FormSelect({
  name,
  options,
  defaultValue,
  placeholder,
  required,
  className,
}: FormSelectProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <>
      <input type="hidden" name={name} value={value} required={required} />
      <Select value={value || undefined} onValueChange={setValue}>
        <SelectTrigger className={cn(className)}>
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
