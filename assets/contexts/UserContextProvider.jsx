import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setItemWithExpiration, getItemWithExpiration } from '../javascript/helpers';
export const UserContext = createContext();

/**
 * UserContextProvider Component
 *
 * A component that provides the UserContext to its children components,
 * manages the state of the user, and includes functions for logging in and logging out.
 *
 * @component
 * @param {Object} children - The React components that this component wraps.
 */
export default function UserContextProvider({children}) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  /**
   * Logs out the current user by removing the user from local storage and resetting the state.
   */
  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser({});
    navigate('/')
  }

  /**
   * Logs in the user and sets the user in both state and local storage.
   *
   * @param {Object} user - The user object to be logged in.
   */
  const loginUser = (user) => { 
    setUser(user);
    setItemWithExpiration('user', JSON.stringify(user), 10);
    navigate('/');
  }

  // Context value containing user and related functions
  const contextValue = {
    user,
    loginUser,
    logoutUser,
}

// Check for stored user data on component mount
  useEffect(()=> { 
    const storedUser = getItemWithExpiration('user');;

    if(storedUser){
      const user = JSON.parse(storedUser);
      setUser(user);
    }
  }, [])

  // Provide the context value to children components
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
    
  )
}
