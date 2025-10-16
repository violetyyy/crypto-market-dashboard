"use client";

import * as React from "react";

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleItemClick = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" data-value={selectedValue}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: () => setIsOpen(!isOpen),
              children: React.Children.map(
                (child.props as any).children,
                (grandChild) => {
                  if (
                    React.isValidElement(grandChild) &&
                    grandChild.type === SelectValue
                  ) {
                    return React.cloneElement(
                      grandChild as React.ReactElement<any>,
                      {
                        children:
                          selectedValue ||
                          (grandChild.props as any).placeholder,
                      }
                    );
                  }
                  return grandChild;
                }
              ),
            });
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child as React.ReactElement<any>, {
              children: React.Children.map(
                (child.props as any).children,
                (grandChild) => {
                  if (
                    React.isValidElement(grandChild) &&
                    grandChild.type === SelectItem
                  ) {
                    return React.cloneElement(
                      grandChild as React.ReactElement<any>,
                      {
                        onClick: () =>
                          handleItemClick((grandChild.props as any).value),
                      }
                    );
                  }
                  return grandChild;
                }
              ),
            });
          }
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({
  className = "",
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`h-10 w-full rounded-md border px-3 text-left ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return <span>{children || placeholder}</span>;
}

export function SelectContent({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-1 shadow-md"
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  onClick,
  ...props
}: {
  value: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      role="option"
      data-value={value}
      className="cursor-pointer rounded-sm px-2 py-1 hover:bg-accent"
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
