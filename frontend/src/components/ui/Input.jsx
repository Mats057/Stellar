import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input 
      ref={ref}
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;