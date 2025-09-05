import { Bell } from "lucide-react";

export function Notification({ notification }) {
  if (!notification) return null;

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const type = notification.type || "success";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
        styles[type] || styles.success
      } flex items-center space-x-2 animate-in slide-in-from-right duration-300`}
    >
      <Bell className="w-4 h-4" />
      <span className="font-medium">{notification.message}</span>
    </div>
  );
}
