export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...htmlProps
}) => {
  return (
    <button
      {...htmlProps}
      className={`className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400" ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
};
