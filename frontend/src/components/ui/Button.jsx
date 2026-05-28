import { forwardRef } from 'react';

const Button = forwardRef(({ children, className = '', variant = 'primary', loading = false, ...props }, ref) => {
  const baseStyles = "relative flex items-center justify-center font-bold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
      primary: "bg-gray-900 text-white hover:bg-black",
      secondary: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-indigo-600",
      accent: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.6)]"
  };

  return (
    <button 
      ref={ref}
      disabled={loading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <div className="animate-[spin_2s_linear_infinite] rounded-full h-5 w-5 border-t-2 border-b-2 border-current opacity-70"></div>
          {children}
        </span>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;