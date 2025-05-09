import React from 'react'
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from '../contexts/UserContextProvider';
import { useContext } from "react";

/**
 * PathAuthenticator Component
 *
 * A component responsible for authenticating user access to specific paths.
 * Redirects unauthenticated users to the login page.
 *
 * @component
 * @param {Object} children - The React components that this component wraps.
 */
export default function PathAuthenticator({ children }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (user.username === undefined) {
    return <Navigate to='/login' state={{ from: location.pathname }} />;
  }


  return <>{children}</>;
}
