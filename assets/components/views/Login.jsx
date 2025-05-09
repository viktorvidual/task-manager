import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContextProvider';
import { fetchCsrfToken } from '../../services/CsrfToken';

/**
 * Login Component
 *
 * React component responsible for rendering a login form,
 * handling user input, and processing login submissions.
 *
 * @component
 */
export default function Login() {
  const { loginUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Fetching CSRF token for authentication
    // const token = await fetchCsrfToken();
    // // Configuring headers with CSRF token
    // const headers = {
    //   'X-CSRF-Token': token,
    // };

    try {
      const response = await axios.post('/api/auth', formData);

      console.log('User logged in successfully');
      loginUser({username: response.data.username})

    } catch (error) {
      if(console.error('Error logging in', error.response.data)){
        setError(error.response.data)
      }else{
        setError('Invalid credentials. Please try again.');
      }
      
    }

  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-600">Username:</label>
          <input
            type="text"
            name="username"
            className="form-input w-full m-2"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Password:</label>
          <input
            type="password"
            name="password"
            className="form-input w-full m-2"
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
