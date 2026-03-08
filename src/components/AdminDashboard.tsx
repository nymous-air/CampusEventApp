import React, { useState } from 'react';

const AdminDashboard = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleAddEvent = () => {
    alert(`Event "${eventTitle}" on ${eventDate} added successfully!`);
    setEventTitle('');
    setEventDate('');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <input type="text" placeholder="Event Title" className="block w-full p-2 border rounded my-2" onChange={(e) => setEventTitle(e.target.value)} />
      <input type="date" className="block w-full p-2 border rounded my-2" onChange={(e) => setEventDate(e.target.value)} />
      <button onClick={handleAddEvent} className="bg-green-600 text-white px-4 py-2 rounded">Add Event</button>
    </div>
  );
};

export default AdminDashboard;
