/*
  # Seed Sample Events

  1. Sample Data
    - Creates an admin user for sample events
    - Creates 5 diverse college events:
      - Tech Hackathon
      - Arts Festival
      - Sports Tournament
      - Academic Lecture
      - Social Mixer

  2. Notes
    - All events are upcoming (scheduled in the future)
    - Events have varying capacities and categories
    - Each event has realistic descriptions and locations
    - Events are associated with a default admin user
*/

-- First, create a default admin user if it doesn't exist
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Insert into auth.users and get the ID
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@university.edu',
        crypt('admin123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"role":"admin"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO admin_user_id;

    -- Insert sample events using the admin user ID
    INSERT INTO events (
        title,
        description,
        date,
        location,
        category,
        organizer,
        image_url,
        max_attendees,
        current_attendees,
        user_id
    ) VALUES
    (
        'Spring Innovation Hackathon 2025',
        'Join us for a 48-hour coding challenge where students collaborate to build innovative solutions for campus sustainability. Prizes include internship opportunities and the latest tech gadgets. All skill levels welcome!',
        '2025-04-15 09:00:00+00',
        'Technology Innovation Center, Room 201',
        'Technology',
        'Computer Science Department',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
        100,
        0,
        admin_user_id
    ),
    (
        'Campus Arts & Culture Festival',
        'Experience a vibrant celebration of creativity featuring student artwork, live performances, interactive installations, and workshops. This year''s theme: "Digital Meets Traditional".',
        '2025-04-20 11:00:00+00',
        'University Arts Center',
        'Arts',
        'Fine Arts Department',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000',
        200,
        0,
        admin_user_id
    ),
    (
        'Inter-College Sports Championship',
        'The biggest sporting event of the year! Compete in basketball, soccer, volleyball, and track & field. Special exhibition matches and professional athlete guest appearances.',
        '2025-05-01 10:00:00+00',
        'University Sports Complex',
        'Sports',
        'Athletics Department',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000',
        500,
        0,
        admin_user_id
    ),
    (
        'Future of AI: Distinguished Lecture Series',
        'Distinguished Professor Sarah Chen discusses the latest breakthroughs in artificial intelligence and their implications for society. Q&A session and networking reception to follow.',
        '2025-04-25 15:00:00+00',
        'Main Auditorium',
        'Academic',
        'Computer Science Department',
        'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&q=80&w=1000',
        150,
        0,
        admin_user_id
    ),
    (
        'Spring Networking Mixer',
        'Connect with fellow students, alumni, and industry professionals in a casual setting. Enjoy refreshments, music, and meaningful conversations. Perfect opportunity for internship and career discussions.',
        '2025-04-10 18:00:00+00',
        'Student Union Ballroom',
        'Social',
        'Career Services',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
        300,
        0,
        admin_user_id
    );
END $$;