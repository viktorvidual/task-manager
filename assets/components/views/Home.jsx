import React, { useContext } from 'react'
import { TasksContext } from '../../contexts/TasksContext';
import TaskList from '../TaskList';

/**
 * Home Component
 *
 * The main component representing the home page or main content area of the application.
 * Utilizes the Context API to access and display a list of tasks.
 *
 * @component
 */
export default function Home() {

    const { tasks } = useContext(TasksContext);

  return (
    <div>
      <TaskList tasks={tasks} title={'All Tasks'} />
    </div>
  )
}
