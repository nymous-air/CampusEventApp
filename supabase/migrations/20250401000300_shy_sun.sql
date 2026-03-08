/*
  # Fix RSVP RLS Policies

  1. Changes
    - Drop and recreate RLS policies for event_attendees table
    - Add proper user_id check for inserts
    - Ensure event existence check
    - Fix policy conditions for better security

  2. Security
    - Policies ensure users can only RSVP as themselves
    - Validate event existence before allowing RSVP
    - Maintain existing select and delete policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can register for events" ON event_attendees;
DROP POLICY IF EXISTS "Users can view their own attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can remove their attendance" ON event_attendees;

-- Recreate policies with proper conditions
CREATE POLICY "Users can register for events"
    ON event_attendees
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND  -- Ensure user can only RSVP as themselves
        EXISTS (                   -- Ensure event exists
            SELECT 1 
            FROM events 
            WHERE id = event_id
        )
    );

CREATE POLICY "Users can view their own attendance"
    ON event_attendees
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their attendance"
    ON event_attendees
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);