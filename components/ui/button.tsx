// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#0047AB] hover:bg-blue-500 px-6 py-2 rounded-md ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;