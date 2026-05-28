export default function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 border-gray-200',
        success: 'bg-green-100 text-green-700 border-green-200',
        danger: 'bg-red-100 text-red-600 border-red-200',
        primary: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
