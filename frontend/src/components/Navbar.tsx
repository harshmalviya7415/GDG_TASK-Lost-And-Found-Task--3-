import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { Bell, LogOut } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";

interface Navbarprop {
  brandName: string;
  links: Array<{ label: string; href: string }>;
  theme?: string;
  textColor?: string;
  fontSize?: number;
  height?: number;
  padding?: number;
  onAddClick?: () => void;
  onBrandClick?: () => void;
  currentUser?: any;
  notifications?: any[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onLogout?: () => void;
}

const Navbar = ({
  brandName,
  links,
  padding,
  textColor,
  fontSize,
  height,
  theme,
  onAddClick,
  onBrandClick,
  currentUser,
  notifications = [],
  onMarkRead = () => {},
  onMarkAllRead = () => {},
  onLogout = () => {},
}: Navbarprop) => {
  const isDark = theme === "dark";
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const finalTextColor = textColor || (isDark ? "#ffffff" : "#0f172a");
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav
      className="w-full flex items-center justify-between border-b transition-all duration-300 relative z-30"
      style={{
        backgroundColor,
        borderColor,
        padding: padding !== undefined ? `${padding}px 24px` : "16px 24px",
        color: finalTextColor,
        fontSize: fontSize !== undefined ? `${fontSize}px` : undefined,
        height: height !== undefined ? `${height}px` : undefined,
      }}
    >
      <div 
        onClick={onBrandClick}
        className="flex items-center gap-2 font-bold tracking-tight text-xl cursor-pointer hover:opacity-80 transition-all shrink-0"
      >
        <span>{brandName}</span>
      </div>

      <div className="flex items-center gap-6">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="font-medium transition-all duration-200 relative group py-1 text-sm"
            style={{ color: finalTextColor }}
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

      <div className="flex items-center gap-4 shrink-0">
        {currentUser ? (
          <>
            <Button 
              name="Add Lost Item" 
              theme={theme === "dark" ? "light" : "dark"} 
              onClick={onAddClick}
            />

            {/* Notifications Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer relative"
                style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}
              >
                <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationsDropdown
                notifications={notifications}
                onMarkRead={onMarkRead}
                onMarkAllRead={onMarkAllRead}
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-end text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-100">{currentUser.username}</span>
                <span className="text-[10px] text-slate-400">User</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
