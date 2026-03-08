/*
  # Add Cancel Reminder Feature
  
  1. Changes
    - Add cancel_reminder column to notifications table
    - Add function to handle reminder cancellation
    - Update notification policies
    
  2. Security
    - Allow users to update their own notifications
*/

-- Add cancel_reminder column to notifications table
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS cancelled boolean DEFAULT false;

-- Update notifications policies to allow updates
CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Update the notify_upcoming_event function to check for cancelled notifications
CREATE OR REPLACE FUNCTION notify_upcoming_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for upcoming event (24 hours before)
    INSERT INTO notifications (
        user_id,
        event_id,
        type,
        message,
        cancelled
    )
    VALUES (
        NEW.user_id,
        NEW.event_id,
        'event_reminder',
        'Reminder: Event "' || (SELECT title FROM events WHERE id = NEW.event_id) || '" is tomorrow!',
        false
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;