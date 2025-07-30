import * as React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border border-gray-300 px-3 py-2 rounded-md text-sm ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
