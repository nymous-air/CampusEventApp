export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  organizer: string;
  image_url: string;
  max_attendees: number;
  current_attendees: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  interests: string[];
}