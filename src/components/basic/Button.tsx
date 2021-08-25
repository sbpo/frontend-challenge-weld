export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...htmlProps
}) => {
  return (
    <button
      {...htmlProps}
      className={`bg-white py-1 px-2 shadow rounded border border-gray-200 text-xs focus:outline-none hover:font-medium focus:ring focus:ring-blue-400 ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
};
