import Button from "./Button";

interface Navbarprop {
  brandName: string;
  links: Array<{ label: string; href: string }>;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  padding?: number;
}

const Navbar = ({
  brandName,
  links,
  padding,
  textColor,
  fontSize,
  height,
  theme,
}: Navbarprop) => {
  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <nav
      className="w-full flex items-center justify-between border-b transition-all duration-300"
      style={{
        backgroundColor,
        borderColor,
        padding: padding !== undefined ? `${padding}px 24px` : "16px 24px",
        color: finalTextColor,
        fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
        height: height !== undefined ? `${height}px` : undefined,
      }}
    >
  
      <div className="flex items-center gap-2 font-bold tracking-tight text-xl cursor-pointer hover:opacity-80 transition-opacity">
        <span>
          {brandName}
        </span>
      </div>


      <div className="flex items-center gap-6">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="font-medium transition-colors duration-200 relative group py-1"
            style={{
              color: finalTextColor,
            }}
          >
            {link.label}
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              style={{
                backgroundColor: isDark ? "#3b82f6" : "#2563eb",
              }}
            />
          </a>
        ))}
      </div>

  
      <div className="flex items-center gap-4">
        <Button name="Add Lost Item" theme={theme === "dark" ? "light" : "dark"} />
      </div>
    </nav>
  );
};

export default Navbar;
