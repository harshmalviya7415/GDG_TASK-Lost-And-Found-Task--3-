interface Buttonprop {
  name: string;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  padding?: number;
}

const Button = ({
  name,
  padding,
  textColor,
  fontSize,
  height,
  theme,
}: Buttonprop) => {
  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#2762E9" : "#f8fafc";

  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");

  return (
    <button
      className="inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
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
