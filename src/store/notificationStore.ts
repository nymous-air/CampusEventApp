import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  cancelled: boolean;
  created_at: string;
  event_id: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  cancelReminder: (id: string) => Promise<void>;
  subscribeToNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }
    
    set({
      notifications: data || [],
      unreadCount: (data || []).filter(n => !n.read && !n.cancelled).length
    });
  },
  
  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }
    
    await get().fetchNotifications();
  },

  cancelReminder: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ cancelled: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error cancelling reminder:', error);
      return;
    }
    
    await get().fetchNotifications();
  },
  
  subscribeToNotifications: () => {
    const channel = supabase
      .channel('notifications_channel')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          get().fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
}));