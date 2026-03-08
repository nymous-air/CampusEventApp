import React from 'react';
import { Bell, X, XCircle } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { notifications, markAsRead, cancelReminder } = useNotificationStore();

  if (!isOpen) return null;

  const activeNotifications = notifications.filter(n => !n.cancelled);

  return (
    <div className="fixed right-4 top-20 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-indigo-50">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-lg">Notifications</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
        {activeNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y">
            {activeNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  notification.read ? 'opacity-75' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    )}
                    {notification.type === 'event_reminder' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelReminder(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Cancel reminder"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}