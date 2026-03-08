import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Routes, Navigate } from 'react-router-dom';
import { Calendar, Bell } from 'lucide-react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { User } from 'firebase/auth';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';

// Firebase config (Replace with your own config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (firebase.getApps().length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState('student'); // Default role is student
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user as User | null);
      if (user) {
        // Fetch user role from database (mocked for now)
        setRole(user.email === 'admin@example.com' ? 'admin' : 'student');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-indigo-600 text-white">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Campus Events</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              {user ? (
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors" onClick={() => firebase.auth().signOut()}>
                  Logout
                </button>
              ) : (
                <a href="/login" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Sign In
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={user && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  </Router>
);
}

export default App;
