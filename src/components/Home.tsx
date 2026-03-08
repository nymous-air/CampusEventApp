import React from 'react';

interface User {
    id: string;
    name: string;
  }
  
  interface HomeProps {
    user?: User | null;
  }
  
  const Home: React.FC<HomeProps> = ({ user }: HomeProps) => {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Annual Tech Symposium</h3>
          <p>Join us for a day of innovation and technology discussions.</p>
          {user ? (
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
              RSVP Now
            </button>
          ) : (
            <p className="text-gray-500 mt-2">Sign in to RSVP.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Home;
