"use client";

import { useState, useEffect } from "react";
import {
  X,
  Bell,
  Mail,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock notifications for demo purposes
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "success",
      title: "Campaign Sent Successfully",
      message: 'Your "Q4 Product Launch" campaign has been sent to 156 leads.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      read: false,
      actionUrl: "/campaigns",
    },
    {
      id: "2",
      type: "info",
      title: "New Leads Added",
      message: "23 new leads have been imported from your latest CSV upload.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      actionUrl: "/leads",
    },
    {
      id: "3",
      type: "warning",
      title: "API Rate Limit Warning",
      message: "Your OpenAI API usage is approaching the monthly limit.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: true,
      actionUrl: "/settings",
    },
    {
      id: "4",
      type: "success",
      title: "Lead Converted",
      message: "John Smith from Acme Corp has replied to your outreach email!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
      actionUrl: "/leads",
    },
    {
      id: "5",
      type: "error",
      title: "Campaign Failed",
      message:
        'Unable to send "Follow-up Sequence" due to email configuration issues.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      read: true,
      actionUrl: "/settings",
    },
  ];

  useEffect(() => {
    // In a real app, this would fetch from an API
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-16 right-4 ml-auto mr-4 p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
          <span className="text-sm text-gray-500">
            {notifications.length} total
          </span>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  notification.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            notification.read
                              ? "text-gray-900"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-sm ${
                            notification.read
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <button
                        onClick={() => {
                          // In a real app, this would navigate to the URL
                          toast.info(
                            `Would navigate to: ${notification.actionUrl}`
                          );
                          markAsRead(notification.id);
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                toast.info("Would navigate to full notifications page");
                onClose();
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Notification Bell Component for Header
export function NotificationBell({ onClick }: { onClick: () => void }) {
  const [unreadCount] = useState(3); // Mock unread count

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
      aria-label="View notifications"
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold leading-4 bg-red-500 text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
