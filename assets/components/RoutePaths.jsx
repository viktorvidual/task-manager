import React from 'react'
import { Routes, Route } from "react-router-dom";
import CreateTask from './views/CreateTask';
import EditTask from './views/EditTask';
import Login from './views/Login';
import Register from './views/Register';
import Home from './views/Home';
import Account from './views/Account';
import PathAuthenticator from './PathAuthenticator';


/**
 * RoutePaths Component
 *
 * This component defines the routing paths for your application using React Router's Routes and Route components.
 * It establishes the relationship between URLs and the components that should be rendered when a particular URL is accessed.
 *
 * @component
 * @example
 * // Usage of RoutePaths component in your main App component or routing configuration:
 * import RoutePaths from './RoutePaths';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <RoutePaths />
 *     </BrowserRouter>
 *   );
 * }
 *
 * @returns {JSX.Element} The JSX element representing the configured routes for the application.
 */

export default function RoutePaths() {
  return (
    <div>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<PathAuthenticator><CreateTask /></PathAuthenticator>} />
        <Route path="/edit/:id" element={<PathAuthenticator><EditTask /></PathAuthenticator>} />
        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/account/" element={<PathAuthenticator><Account/></PathAuthenticator>} />
    </Routes>
    </div>
  )
}
