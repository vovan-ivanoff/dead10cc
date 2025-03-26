import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.ComponentProps<"input"> {
  label?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CustomInputProps>(
  ({ className, type, label, multiline, rows, icon, iconPosition = "left", ...props }, ref) => {
    const commonClasses = cn(
      "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D1286] focus-visible:border-[#5D1286] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      !multiline && "h-9",
      multiline && "min-h-[80px]",
      icon && iconPosition === "left" && "pl-10",
      icon && iconPosition === "right" && "pr-10",
      className
    );

    const inputElement = multiline ? (
      <textarea
        className={commonClasses}
        rows={rows}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        {...props as React.ComponentProps<"textarea">}
      />
    ) : (
      <div className="relative w-full">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={commonClasses}
          ref={ref as React.Ref<HTMLInputElement>}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    );

    return label ? (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {inputElement}
      </div>
    ) : (
      inputElement
    );
  }
);
Input.displayName = "Input";

export { Input };