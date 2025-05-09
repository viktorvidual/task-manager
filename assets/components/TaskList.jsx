import React, { useContext, useState } from 'react';
import { TasksContext } from '../contexts/TasksContext';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContextProvider';
import { isDateTodayOrPast } from '../javascript/helpers';
import moment from 'moment';
import axios from 'axios';

const TaskList = ({ tasks, title }) => {
  const { assignTask, deleteTask, updateSingleTask, sortTasksByDueDate, sortTasksByCreatedOn } = useContext(
    TasksContext
  );
  const { user } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  async function solveTask(taskId) {
    try {
      const response = await axios.post(`/api/solve/${taskId}`);
      updateSingleTask(response.data.task);
      console.log(response.data.task);
    } catch (error) {
      console.error('Error solving task', error);
    }
  }

  async function openTask(taskId) {
    try {
      const response = await axios.post(`/api/open/${taskId}`);
      updateSingleTask(response.data.task);
      console.log(response.data.task);
    } catch (error) {
      console.error('Error solving task', error);
    }
  }

  return (
    <div className="w-4/5 mx-auto text-center mb-5">
      <h1 className="text-6xl pt-12 pb-8 font-extrabold">{title}</h1>
      <div className='mb-5'>
      <span className="font-light text-gray-500 italic">{tasks.length} Available</span>
      </div>
      <div>
        <table className="table-auto mx-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 ">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">
                <button
                  className="text-blue-700 px-4 py-2 rounded"
                  onClick={sortTasksByCreatedOn}
                >
                  CreatedOn
                </button>
              </th>

              <th className="border px-4 py-2">
                <button
                  className="text-blue-700 px-4 py-2 rounded"
                  onClick={sortTasksByDueDate}
                >
                  DueDate
                </button>
              </th>

              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Assignee</th>
              {user.username && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task.id} className={task.isDone ? 'bg-white text-gray-300' : 'bg-white'}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">{moment(task.createdOn).format('yyyy-MM-DD')}</td>
                <td
                  className={
                    isDateTodayOrPast(task.dueDate) && !task.isDone
                      ? `text-red-500 border px-4 py-2 font-extrabold`
                      : `border px-4 py-2`
                  }
                >
                  {moment(task.dueDate).format('yyyy-MM-DD')}
                </td>

                <td className="border px-4 py-2">{task.isDone ? 'complete' : 'open'}</td>
                <td className="border px-4 py-2">
                  {task.user ? (
                    task.user
                  ) : !task.isDone && user.username ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 flex-shrink-0"
                      onClick={() => assignTask(task.id, user.username)}
                    >
                      assign
                    </button>
                  ) : null}
                </td>
                {user.username && (
                  <td className="border px-4 py-2 text-center">
                    <div className="flex">
                      {task.isDone ? (
                        <>
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2 flex-shrink-0"
                            onClick={() => openTask(task.id)}
                          >
                            Open
                          </button>
                          <Link
                            to={`/edit/${task.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex-shrink-0 mr-2 "
                          >
                            Edit
                          </Link>

                          <button
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 mr-2 flex-shrink-0"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2 flex-shrink-0"
                            onClick={() => solveTask(task.id)}
                          >
                            Solve
                          </button>
                          <Link
                            to={`/edit/${task.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex-shrink-0 mr-2 "
                          >
                            Edit
                          </Link>
                        </>
                      )}
                      {!task.isDone &&
                        task.user !== user?.username && (
                          <button
                            className="bg-red-300 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2 flex-shrink-0 mr-2 "
                            onClick={() => assignTask(task.id, user.username)}
                          >
                            Reassign
                          </button>
                        )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <nav className="inline-flex">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-l"
            >
              <span>&laquo;</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-r"
            >
              <span>&raquo;</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
