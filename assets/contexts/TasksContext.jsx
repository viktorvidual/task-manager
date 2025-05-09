import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const TasksContext = createContext();

/**
 * TasksContextProvider Component
 *
 * A component that provides the TasksContext to its children components,
 * manages the state of tasks, and includes functions for updating, deleting, and sorting tasks.
 *
 * @component
 * @param {Object} children - The React components that this component wraps.
 */
export default function TasksContextProvider({children}) {
    const[tasks, setTasks] = useState([]);
    const [ allTasks, setAllTasks ] = useState();
    const navigate = useNavigate();

    /**
    * Updates the tasks state by adding a new task.
    *
    * @param {Object} newTask - The new task to be added.
    */
    const updateTasks = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    /**
     * Updates a single task in the tasks state.
     *
     * @param {Object} updatedTask - The updated task object.
     */
    const updateSingleTask = (updatedTask) => {
 
      const updatedIndex = tasks.findIndex(task => task.id === updatedTask.id);
  
      const updatedTasks = [...tasks];
      updatedTasks[updatedIndex] = updatedTask;
  
      setTasks(updatedTasks);
    };

    /**
     * Deletes a task from the tasks state and the server.
     *
     * @param {string} taskId - The ID of the task to be deleted.
     */
    const deleteTask = async(taskId) => {

      try{
        const response = await axios.delete(`/api/delete/${taskId}`);
        console.log(response.data.task);
      }catch(error){
        console.error(error)
      }
      
      const updatedTasks = tasks.filter((task) => task.id != taskId);
      setTasks(updatedTasks);
    };

    /**
     * Assigns a task to a user.
     *
     * @param {string} taskId - The ID of the task to be assigned.
     * @param {string} username - The username of the user to whom the task is assigned.
     */
    const assignTask = async(taskId, username) => { 
      try {
        const response = await axios.post(`/api/assign-task/${taskId}/${username}`);
        updateSingleTask(response.data.task);
        console.log('Task assigned successfully', response.data);
      
      } catch (error) {
        console.error('Error assigning task', error);
      }finally{
        navigate('/')
      }
    }

    /**
     * Sorts tasks by their due dates.
     */
    const sortTasksByDueDate = () => {
          const sortedTasks = [...tasks];

            sortedTasks.sort((taskA, taskB) => {
              const dueDateA = new Date(taskA.dueDate);
              const dueDateB = new Date(taskB.dueDate);

              // Compare due dates
              if (dueDateA < dueDateB) {
                return -1;
              } else if (dueDateA > dueDateB) {
                return 1;
              } else {
                return 0;
              }
        });

      setTasks(sortedTasks)
    }

    /**
     * Sorts tasks by their creation dates.
     */
    const sortTasksByCreatedOn = () => {
          const sortedTasks = [...tasks];

            sortedTasks.sort((taskA, taskB) => {
              const dateA = new Date(taskA.createdOn);
              const dateB = new Date(taskB.createdOn);

              // Compare due dates
              if (dateA < dateB) {
                return -1;
              } else if (dateB > dateB) {
                return 1;
              } else {
                return 0;
              }
        });

      setTasks(sortedTasks)
    }
  
    useEffect(() => {
      // Fetch tasks from the API when the component mounts
      const fetchTasks = async () => {
        try {
          const response = await fetch('/api/all-tasks');
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
  
      fetchTasks();
    }, [allTasks]);

    const contextValue = {
        tasks,
        updateTasks,
        updateSingleTask,
        deleteTask,
        assignTask,
        sortTasksByDueDate,
        sortTasksByCreatedOn,
        setAllTasks
    }

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  )
}


