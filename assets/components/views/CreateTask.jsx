import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TasksContext } from '../../contexts/TasksContext';
import moment from 'moment';
import axios from 'axios';

/**
 * CreateTask Component
 *
 * The CreateTask component is responsible for rendering a form to create a new task. It utilizes the
 * useForm hook from the 'react-hook-form' library for form management. The form allows users to input
 * a title, description, and deadline for the new task. Upon submission, the task is sent to the server
 * using an HTTP POST request, and the global state is updated with the newly created task.
 *
 * @component
 */

export default function CreateTask() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const context = useContext(TasksContext);
  const navigate = useNavigate();

  /**
   * onSubmit Function
   *
   * This function is called when the form is submitted. It makes an asynchronous HTTP POST request
   * to create a new task using the '/api/create' endpoint. Upon success, the global state is updated
   * with the newly created task, and the user is navigated back to the home page.
   *
   * @async
   * @param {Object} data - Form data containing title, description, and dueDate.
   */
  const onSubmit = async(data) => {
    try {
      const response = await axios.post('/api/create', data);
      context.updateTasks(response.data.task);
      console.log('Task created successfully', response.data);
    
    } catch (error) {
      console.error('Error creating task', error);
    }finally{
      navigate('/')
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Create a Task</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className='m-5'>
          <label className="block text-gray-600">Title:</label>
          <input type="text" className="form-input w-full m-2" {...register('title', { required: true })} />
        </div>

        <div className='m-5'>
          <label className="block text-gray-600 m-2">Description:</label>
          <textarea className="form-input w-full" {...register('description', { required: true })} />
        </div>

        <div className='m-5'>
          <label className="block text-gray-600">Deadline:</label>
          <input type="date" className="form-input w-full m-2" {...register('dueDate', { required: true, 
             validate: (value) => {
              const selectedDate = moment(value, 'YYYY-MM-DD', true);
              const today = moment().startOf('day');

              return selectedDate.isSameOrAfter(today) || 'Deadline must be in the future';
            },
          })} />
          {errors.dueDate && <p className="text-red-500">{errors.dueDate.message}</p>}
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
        </div>
      </form>
    </div>
  )
}
