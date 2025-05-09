import './styles/app.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import TasksContextProvider from './contexts/TasksContext';
import TaskList from './components/TaskList';
import Header from './components/Header';
import Footer from './components/Footer';
import RoutePaths from './components/RoutePaths';
import { BrowserRouter as Router } from "react-router-dom";
import UserContextProvider from './contexts/UserContextProvider';

// Defining the main App component
export default function App() {
    // JSX structure for the App component
  return (
    <>
    <Router>
      <TasksContextProvider>
        <UserContextProvider>
        <Header/>
        <RoutePaths />
        <Footer />
        </UserContextProvider>
      </TasksContextProvider>
    </Router>
    </>
  )
}

// Rendering the App component to the root element in the HTML document
// The root location is /templates/index.html.twig
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  