import { Bell, Check } from "lucide-react";

interface NotificationItem {
  _id: string;
  itemId?: {
    _id: string;
    title: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsDropdownProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  isOpen,
  onClose,
}: NotificationsDropdownProps) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-left">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-blue-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                if (notif.itemId?._id) {
                  window.location.hash = `#/item/${notif.itemId._id}`;
                }
                if (!notif.isRead) {
                  onMarkRead(notif._id);
                }
                onClose();
              }}
              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group flex justify-between gap-3 text-xs ${
                !notif.isRead ? "bg-blue-50/30 dark:bg-blue-950/10 font-medium" : "text-slate-500"
              }`}
            >
              <div className="flex-1 pr-4">
                <p className="text-slate-700 dark:text-slate-300 leading-snug">{notif.message}</p>
                {notif.itemId && (
                  <span className="inline-block mt-1 text-[10px] text-blue-500 font-semibold uppercase tracking-wider">
                    Item: {notif.itemId.title}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!notif.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(notif._id);
                  }}
                  className="self-center p-1 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-500 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">No notifications yet.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
