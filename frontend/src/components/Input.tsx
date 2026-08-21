interface Inputprop {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  padding?: number;
}

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  padding,
  textColor,
  fontSize,
  height,
  theme,
}: Inputprop) => {
  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#1e293b" : "#f8fafc";
  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");
  const borderColor = isDark ? "#334155" : "#e2e8f0";

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-xs font-semibold uppercase tracking-wide opacity-80" style={{ color: finalTextColor }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-transparent"
        style={{
          backgroundColor,
          borderColor,
          color: finalTextColor,
          padding: padding !== undefined ? `${padding}px` : "10px 14px",
          fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
          height: height !== undefined ? `${height}px` : undefined,
        }}
      />
    </div>
  );
};

export default Input;
