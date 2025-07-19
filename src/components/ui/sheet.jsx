import * as React from "react";

export const Sheet = ({ children }) => (
  <div className="hidden md:block">{children}</div>
);

export const SheetTrigger = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export const SheetContent = ({ children, className = "" }) => (
  <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 space-y-6 z-50 ${className}`}>
    {children}
  </div>
);
