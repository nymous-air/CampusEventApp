/*
  # Add Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `event_id` (uuid, references events)
      - `type` (text) - notification type (e.g., 'event_reminder', 'event_update')
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on notifications table
    - Add policies for user access
    
  3. Triggers
    - Create trigger for event updates
    - Create trigger for upcoming event reminders
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    event_id uuid REFERENCES events(id) NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Function to create notifications for event updates
CREATE OR REPLACE FUNCTION notify_event_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notifications for all users who RSVP'd to this event
    INSERT INTO notifications (user_id, event_id, type, message)
    SELECT 
        ea.user_id,
        NEW.id,
        'event_update',
        CASE
            WHEN OLD.date != NEW.date THEN 'Event "' || NEW.title || '" has a new date: ' || NEW.date
            WHEN OLD.location != NEW.location THEN 'Event "' || NEW.title || '" has moved to: ' || NEW.location
            ELSE 'Event "' || NEW.title || '" has been updated'
        END
    FROM event_attendees ea
    WHERE ea.event_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event updates
CREATE TRIGGER event_update_notification
    AFTER UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION notify_event_update();

-- Function to create notifications for upcoming events
CREATE OR REPLACE FUNCTION notify_upcoming_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for upcoming event (24 hours before)
    INSERT INTO notifications (user_id, event_id, type, message)
    VALUES (
        NEW.user_id,
        NEW.event_id,
        'event_reminder',
        'Reminder: Event "' || (SELECT title FROM events WHERE id = NEW.event_id) || '" is tomorrow!'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new RSVPs
CREATE TRIGGER upcoming_event_notification
    AFTER INSERT ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION notify_upcoming_event();