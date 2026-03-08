/*
  # Add Event Attendance Counter

  1. Changes
    - Add trigger function to update event attendance count
    - Add trigger for RSVP changes (insert/delete)
    - Add capacity check before allowing RSVPs
    
  2. Security
    - Prevent RSVPs when event is at capacity
    - Maintain data consistency with atomic updates
*/

-- Function to update event attendance count
CREATE OR REPLACE FUNCTION update_event_attendance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Check if event is full before allowing RSVP
        IF (
            SELECT current_attendees >= max_attendees 
            FROM events 
            WHERE id = NEW.event_id
        ) THEN
            RAISE EXCEPTION 'Event is at capacity';
        END IF;
        
        -- Increment current_attendees
        UPDATE events 
        SET current_attendees = current_attendees + 1
        WHERE id = NEW.event_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement current_attendees
        UPDATE events 
        SET current_attendees = GREATEST(current_attendees - 1, 0)
        WHERE id = OLD.event_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS event_attendance_update ON event_attendees;

-- Create trigger for attendance tracking
CREATE TRIGGER event_attendance_update
    AFTER INSERT OR DELETE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendance();