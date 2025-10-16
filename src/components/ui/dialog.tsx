"use client";

import * as React from "react";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div data-state="open" role="dialog" aria-modal="true" data-dialog>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogContent) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClose: () => onOpenChange?.(false),
          });
        }
        return child;
      })}
    </div>
  );
}

export function DialogContent({
  className = "",
  children,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div
        className={`relative z-10 w-full max-w-lg rounded-lg border border-gray-700 bg-black p-6 shadow-lg ${className}`}
        {...props}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="absolute top-4 right-4 text-white hover:text-gray-400 transition-colors z-20"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 ${className}`} {...props} />;
}

export function DialogTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-xl font-semibold text-white ${className}`}
      {...props}
    />
  );
}

export default Dialog;
