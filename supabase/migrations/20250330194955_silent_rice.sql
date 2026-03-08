/*
  # Fix RSVP Feature Migration

  This migration adds RSVP functionality with attendance tracking.
  All operations are wrapped in existence checks to prevent conflicts.

  1. Changes
    - Add trigger function for attendance tracking
    - Add trigger for automatic attendance updates
*/

-- Function to update event attendance count
CREATE OR REPLACE FUNCTION update_event_attendance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Check if event is full before allowing RSVP
        IF (SELECT current_attendees >= max_attendees FROM events WHERE id = NEW.event_id) THEN
            RAISE EXCEPTION 'Event is full';
        END IF;
        
        -- Increment current_attendees
        UPDATE events 
        SET current_attendees = current_attendees + 1
        WHERE id = NEW.event_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement current_attendees
        UPDATE events 
        SET current_attendees = current_attendees - 1
        WHERE id = OLD.event_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS event_attendance_update ON event_attendees;

-- Create new trigger for attendance count
CREATE TRIGGER event_attendance_update
    AFTER INSERT OR DELETE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendance();