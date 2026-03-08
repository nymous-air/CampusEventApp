import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-2" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-indigo-600 text-white p-2 rounded">Sign In</button>
      </div>
    </div>
  );
};

export default Login;
