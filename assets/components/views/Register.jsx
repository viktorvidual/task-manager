import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContextProvider';
import { redirect, useNavigate } from 'react-router-dom';

/**
 * Register Component
 *
 * A component responsible for rendering a registration form, handling form submission,
 * and interacting with the user registration API to register a new user.
 *
 * @component
 */
export default function Register() {

  // State to manage form data, errors, and user navigation
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const [ error, setError ] = useState('');

   /**
   * Handles changes in form input fields.
   *
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission.
   *
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {

      const response = await axios.post('/api/register', formData);
      console.log(response.data.user);
      loginUser(response.data.user);
      navigate('/')

    } catch (error) {
        if(error.response.data.errors){
          setError(error.response.data.errors);
        }else{
          setError('Error logging in, please try again later.')
        }
    }
  };

  // Render the registration form
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-600">Username:</label>
          <input
            type="text"
            name="username"
            className="form-input w-full m-2"
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input w-full m-2"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
