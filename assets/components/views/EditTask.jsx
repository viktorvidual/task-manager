import React, { useContext, useEffect, useState } from 'react'
import { TasksContext } from '../../contexts/TasksContext';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

/**
 * EditTask Component
 *
 * The EditTask component is responsible for rendering a form to edit an existing task. It retrieves
 * the task details based on the provided task ID, populates the form with the task data, and allows
 * users to update the title, description, and deadline. Users can also delete the task through a
 * confirmation modal. Upon submission or deletion, the global state is updated accordingly.
 *
 * @component
 */

export default function EditTask() {
    const { tasks, updateSingleTask, deleteTask } = useContext(TasksContext);
    const params = useParams();
    const taskId = params.id;
    const [task, setTask] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues:{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate
        }
    });
    

    /**
   * useEffect Hook
   *
   * This hook is responsible for updating the form values when the 'tasks' array changes.
   * It runs once when the component mounts and each time the 'tasks' array changes.
   *
   * @sideEffect
   */
    useEffect(()=> { 
        if(tasks.length > 0){
            const newTask = tasks.find(el=> el.id == taskId);
            console.log(newTask);
            setTask(newTask);
            setValue('dueDate', moment(newTask.dueDate).format("YYYY-MM-DD"));
            setValue('title', newTask.title);
            setValue('description', newTask.description);
        }
    }, [tasks])
    
    const onSubmit = async(data) => { 

        try {
            console.log(data);
            const response = await axios.post(`/api/edit/${task.id}`, data);
            updateSingleTask(response.data.task);
          } catch (error) {
            console.error('Error editing task', error);
          }finally{
            navigate('/')
          }
    }

    const handleDelete = async () => { 
        try{
            deleteTask(task.id)
        }catch(error){
            console.error(error)
        }finally{
            setShowModal(false);
            navigate('/')
        }
    }

  return (
    <>
    {
        task ? (
            <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Edit Task</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='m-5'>
                    <label className="block text-gray-600">Title:</label>

                    <input 
                    type="text" 
                    className="form-input w-full m-2" 
                    {...register('title', { required: false })}
                    defaultValue={task.title} />

                </div>

                <div className='m-5'>
                    <label className="block text-gray-600 m-2">Description:</label>
                    <textarea 
                    className="form-input w-full" {...register('description', { required: false })}
                    defaultValue={task.description}
                    />
                </div>

                <div className='m-5'>
                    <label className="block text-gray-600">Deadline:</label>
                    <input 
                    type="date" 
                    className="form-input w-full m-2" 
                    {...register('dueDate', { validate: value => new Date(value) > new Date() || 'Deadline must be in the future' })} 
                    defaultValue={moment(task.dueDate).format("YYYY-MM-DD")}
                    />
                    {errors.deadline && <p className="text-red-500">{errors.deadline.message}</p>}
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                </div>

                </form>

                <div className="text-center">
                    <button onClick={()=>setShowModal(true)} className="mt-2 p-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                </div>
            </div>
        ) : (
            <h1 className="text-2xl font-bold mb-4 text-center">Loading</h1>
        )
    }

    {showModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="bg-black opacity-75 fixed inset-0"></div>
         <div className="z-50 bg-white p-4 rounded-md">
           <p>Are you sure that you would like to delete the task?</p>
           <div className="mt-4 flex justify-end">
             <button
               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
               onClick={handleDelete}
             >
               Yes
             </button>
             <button
               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
               onClick={()=>setShowModal(false)}
             >
               No
             </button>
           </div>
         </div>
       </div>
    )}
  </>
  )
}
