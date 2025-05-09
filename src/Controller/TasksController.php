<?php

namespace App\Controller;

use DateTime;
use Exception;
use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


/**
 * TasksController Class
 *
 * Controller class responsible for handling HTTP requests related to tasks,
 * including retrieving, creating, editing, deleting, solving, opening, and assigning tasks.
 *
 * @extends AbstractController
 * @package App\Controller
 */
class TasksController extends AbstractController
{
    /**
     * @var TaskRepository $tasksRepository - Repository for tasks
     */
    private $tasksRepository;
     /**
     * @var EntityManagerInterface $em - Doctrine Entity Manager
     */
    private $em;

     /**
     * Constructor method for TasksController
     *
     * @param TaskRepository $taskRepository - Repository for tasks
     * @param EntityManagerInterface $em - Doctrine Entity Manager
     */
    public function __construct(TaskRepository $taskRepository, EntityManagerInterface $em){
        $this->tasksRepository = $taskRepository;
        $this->em = $em;
    }

    /**
     * Route: /{reactRouting}
     *
     * Renders the main index.html.twig file for React routing.
     */
    #[Route('/{reactRouting}', name: 'index', priority: 1, requirements: ['reactRouting' => '^(?!api).*'] )]
    public function index(): Response
    {;
        return $this->render('index.html.twig');
    }

     /**
     * Route: /api/all-tasks (GET)
     *
     * Retrieves all tasks and returns them as a JSON response.
     * @return JsonResponse
     */
    #[Route('/api/all-tasks', methods: ['GET'], name: 'home_page')]
    public function getAllTasks(): JsonResponse
    {
        $tasks = $this->tasksRepository->findAll();

        $formattedTasks = [];

            foreach ($tasks as $task) {
                $formattedTasks[] = $task->taskToArray();
            }

        $jsonResponse = json_encode($formattedTasks);
        return new JsonResponse($jsonResponse, 200, [], true);
 
    }

    /**
     * Route: /api/create (POST)
     *
     * Creates a new task based on the provided JSON data.
     *
     * @param Request $request - HTTP Request object
     * @return JsonResponse
     */
    #[Route('api/create', name: 'create_task')]   
    
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $task = new Task();
        $task->setTitle($data['title']);
        $task->setDescription($data['description']);
        $task->setDueDate(new DateTime($data['dueDate']));
        $task->setCreatedOn(new DateTime());

        try{
            $this->em->persist($task);
            $this->em->flush();

            return $this->json([
                'task'=> $task->taskToArray(),
            ]);

        }catch(Exception $e){
            return $this->json(['errors' => 'Could not upload task, please try again'], 400);
        }
    }

    /**
     * Route: /api/edit/{id} (POST)
     *
     * Edits an existing task based on the provided JSON data and task ID.
     *
     * @param int $id - Task ID
     * @param Request $request - HTTP Request object
     * @return JsonResponse
     */
     #[Route('api/edit/{id}', name:'edit_task')]
    public function edit($id, Request $request): JsonResponse
    {
       $data = json_decode($request->getContent(), true);

       $task = $this->tasksRepository->find($id);
       
       $task->setTitle($data['title']);
       $task->setDescription($data['description']);
       $task->setDueDate(new DateTime($data['dueDate']));
       
       try{
        $this->em->persist($task);
        $this->em->flush();

        return $this->json([
            'task'=> $task->taskToArray(),
        ]);

        }catch(Exception $e){
            return $this->json(['errors' => 'Could not upload task, please try again'], 400);
        }

    }

    /**
     * Route: /api/delete/{id} (GET, DELETE)
     *
     * Deletes an existing task based on the provided task ID.
     *
     * @param int $id - Task ID
     * @return JsonResponse
     */
     #[Route('api/delete/{id}', name: 'delete_task', methods: ['GET', 'DELETE'])]
    public function delete($id): JsonResponse
    {
        $task = $this->tasksRepository->find($id);
        
        try{
            $this->em->remove($task);
            $this->em->flush();

            return $this->json([
                'task'=> [
                    'id'=> $id,
                ],
            ]);

        }catch(Exception $e){
            return $this->json(['errors' => 'Could not upload task, please try again'], 400);
        };
    }

    /**
     * Route: /api/solve/{id}
     *
     * Marks a task as solved based on the provided task ID.
     *
     * @param int $id - Task ID
     * @return JsonResponse
     *
     */
    #[Route('/api/solve/{id}', name:'solve_task')]
    public function solveTask($id): JsonResponse
    {
       $task = $this->tasksRepository->find($id);
       $task->setIsDone(true);

       try {

            $this->em->persist($task);
            $this->em->flush();

            return $this->json([
                'task'=> $task->taskToArray(),
            ]);

        }catch(Exception $e){
            return $this->json(['errors' => 'Could not upload task, please try again'], 400);
        };
    }

     /**
     * Route: /api/open/{id}
     *
     * Marks a task as open (not solved) based on the provided task ID.
     *
     * @param int $id - Task ID
     * @return JsonResponse
     */
    #[Route('/api/open/{id}', name:'open_task')]
    public function openTask($id): JsonResponse
    {
       $task = $this->tasksRepository->find($id);
       $task->setIsDone(false);

       try{

        $this->em->persist($task);
        $this->em->flush();

        return $this->json([
            'task'=> $task->taskToArray(),
        ]);

       }catch(Exception $e){
        return $this->json(['errors' => 'Could not upload task, please try again'], 400);
    };
       
    }


    /**
     * Route: /api/assign-task/{id}/{username}
     *
     * Assigns a task to a specific user based on the provided task ID and username.
     *
     * @param int $id - Task ID
     * @param string $username - User to whom the task is assigned
     * @return JsonResponse
     */
    #[Route('/api/assign-task/{id}/{username}', name:'assign_task')]
        public function assignTask($id, $username): JsonResponse
    {
       $task = $this->tasksRepository->find($id);
       $task->setUser($username);

       try { 
              $this->em->persist($task);
              $this->em->flush();

              return $this->json([
                'task'=> $task->taskToArray(),
            ]);
       }catch(Exception $e){
        return $this->json(['errors' => 'Could not assign task, please try again'], 400);
    };

    }

    /**
     * Route: /api/account/{username} (GET)
     *
     * Retrieves tasks associated with a specific user and returns them as a JSON response.
     * 
     * The route is currently not being used by the front end of the application. It can be used in the future.
     *
     * @param string $username - User's username
     * @return Response
     */

    #[Route('/api/account/{username}', methods: ['GET'], name: 'account')]
    public function account($username): Response
    {
        $tasks = $this->tasksRepository->findBy(['user' => $username]);
    
        $formattedTasks = [];

        foreach ($tasks as $task) {
            $formattedTasks[] = $task->taskToArray();
        }

        $jsonResponse = json_encode($formattedTasks);
        return new JsonResponse($jsonResponse, 200, [], true);
    }
   
}
