import React, { useContext, useState, useEffect } from 'react'
import { TasksContext } from '../../contexts/TasksContext';
import TaskList from '../TaskList';
import { UserContext } from '../../contexts/UserContextProvider';


/**
 * Account Component
 *
 * The Account component is responsible for displaying a list of tasks associated with the currently logged-in user.
 * It filters the global list of tasks based on the current user and renders the filtered tasks using the TaskList component.
 * @component
*/

export default function Account() {

    const [ userTasks, setTasks ] = useState([]);
    const { tasks } = useContext(TasksContext);
    const { user } = useContext(UserContext);

    /**
     * useEffect Hook
     *
     * This hook is responsible for filtering tasks based on the current user and updating the state.
     * It runs whenever the 'tasks' array changes.
     */
    useEffect(()=> { 
      const filteredTasks = tasks.filter(task => task.user == user.username);
      console.log(filteredTasks);
      setTasks(filteredTasks)

    }, [tasks])

  return (
    <div>
        <TaskList tasks={userTasks} title={'My Tasks'} />
    </div>
  )
}
