import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface EventState {
  rsvpStatus: Record<string, boolean>;
  isRsvping: boolean;
  rsvpForEvent: (eventId: string) => Promise<void>;
  cancelRsvp: (eventId: string) => Promise<void>;
  checkRsvpStatus: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  rsvpStatus: {},
  isRsvping: false,

  rsvpForEvent: async (eventId: string) => {
    set({ isRsvping: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User must be authenticated to RSVP');

      // First check if the event is at capacity
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('current_attendees, max_attendees')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      if (event.current_attendees >= event.max_attendees) {
        throw new Error('Event is at capacity');
      }

      // Attempt to RSVP for the event
      const { error } = await supabase
        .from('event_attendees')
        .insert([
          { 
            event_id: eventId,
            user_id: user.id
          }
        ]);

      if (error) {
        if (error.message.includes('at capacity')) {
          throw new Error('Event is full. Cannot RSVP at this time.');
        }
        throw error;
      }

      // Update local RSVP status
      set(state => ({
        rsvpStatus: { ...state.rsvpStatus, [eventId]: true }
      }));
    } catch (error) {
      console.error('Error RSVPing for event:', error);
      throw error;
    } finally {
      set({ isRsvping: false });
    }
  },

  cancelRsvp: async (eventId: string) => {
    set({ isRsvping: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User must be authenticated to cancel RSVP');

      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local RSVP status
      set(state => ({
        rsvpStatus: { ...state.rsvpStatus, [eventId]: false }
      }));
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      throw error;
    } finally {
      set({ isRsvping: false });
    }
  },

  checkRsvpStatus: async (eventId: string) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set(state => ({
          rsvpStatus: { ...state.rsvpStatus, [eventId]: false }
        }));
        return;
      }

      const { data, error } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Update the RSVP status based on whether data exists
      set(state => ({
        rsvpStatus: { ...state.rsvpStatus, [eventId]: !!data }
      }));
    } catch (error) {
      console.error('Error checking RSVP status:', error);
      // Set the status to false in case of error
      set(state => ({
        rsvpStatus: { ...state.rsvpStatus, [eventId]: false }
      }));
    }
  }
}));