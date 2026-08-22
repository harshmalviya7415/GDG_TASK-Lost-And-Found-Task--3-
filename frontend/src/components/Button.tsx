interface ButtonProps {
  name: string;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  padding?: number;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  name,
  padding,
  textColor,
  fontSize,
  height,
  theme,
  onClick,
  disabled,
}: ButtonProps) => {
  const isDark = theme === "dark";

  const backgroundColor = disabled
    ? (isDark ? "#334155" : "#f1f5f9")
    : (isDark ? "#2762E9" : "#f8fafc");

  const finalTextColor = disabled
    ? (isDark ? "#64748b" : "#94a3b8")
    : (textColor || (isDark ? "#ffffff" : "#0f172a"));

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-300 ${
        disabled ? "cursor-not-allowed opacity-75" : "hover:-translate-y-0.5 cursor-pointer"
      }`}
      style={{
        backgroundColor,
        border: 0,
        padding: padding !== undefined ? `${padding}px` : "10px 20px",
        color: finalTextColor,
        fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
        height: height !== undefined ? `${height}px` : undefined,
      }}
    >
      {name}
    </button>
  );
};

export default Button;
