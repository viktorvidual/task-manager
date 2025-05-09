import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContextProvider';


/**
 * Header Component
 *
 * A component representing the header of the application. Displays the application name,
 * user information, and navigation links based on the user's authentication status.
 *
 * @component
 */
function Header() {
    const { user, logoutUser } = useContext(UserContext)

  return (
    <header className="bg-gray-800 text-white py-4 mb-5">
            <div className="container mx-auto flex justify-between items-center">
         
                {/* Application name */}
                <Link to="/" className="text-2xl font-extrabold">
                    Task Manager
                </Link>
                
                {/* Navigation links and user information */}
                <nav className="flex items-center space-x-4">
                    {/* Display user information if logged in */}
                <div className="mx-auto text-center">
                    <span className="font-light text-white italic">
                            { user.username && `Logged in as ${user.username}`}
                    </span>
                </div>
                
                {/* My Tasks link for authenticated users */}
                {
                    user.username && (
                        <Link 
                        to={`/account`}
                        className="uppercase border border-gray-500 text-md py-2 px-4 rounded transition transition-all hover:bg-white hover:text-gray-800">
                            My Tasks
                        </Link>
                    )
                }

                {/* Create a new Task link for authenticated users */}
                {
                    user.username ? ( 
                        <Link 
                        to="/create" 
                        className="uppercase border border-gray-500 text-md py-2 px-4 rounded transition transition-all hover:bg-white hover:text-gray-800">
                            Create a new Task
                        </Link>
                    ) : ( 

                    /* Login link for unauthenticated users */
                        <Link 
                        to="/login" 
                        className="uppercase border border-gray-500 text-md py-2 px-4 rounded transition transition-all hover:bg-white hover:text-gray-800">
                            Login
                        </Link>
                    )
                }

                {/* Logout button for authenticated users, Register link for unauthenticated users */}
                {
                    user.username ? (
                        <button
                            className="uppercase border border-gray-500 text-md py-2 px-4 rounded transition transition-all hover:bg-white hover:text-gray-800"
                            onClick={logoutUser}
                            >
                        Logout
                        </button>
                    ) : (
                        <Link
                        to="/register"
                        className="uppercase border border-gray-500 text-md py-2 px-4 rounded transition transition-all hover:bg-white hover:text-gray-800"
                    >
                        Register
                    </Link>
                    )
                } 
                </nav>
            </div>
        </header>
  )
}

export default Header;
