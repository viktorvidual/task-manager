<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * RegistrationController Class
 *
 * Controller class responsible for handling user registration and authentication actions.
 *
 * @extends AbstractController
 * @package App\Controller
 */
class RegistrationController extends AbstractController
{
    /**
     * Route: /api/register (POST)
     *
     * Registers a new user based on the provided JSON data.
     *
     * @param Request $request - HTTP Request object
     * @param UserPasswordHasherInterface $userPasswordHasher - Symfony's UserPasswordHasherInterface service
     * @param EntityManagerInterface $entityManager - Doctrine Entity Manager
     * @param UserRepository $userRepository - Repository for user entities
     * @return JsonResponse
     */
    #[Route('/api/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager, UserRepository $userRepository): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        $username = $data['username'];
        $password = $data['password'];

        if ($userRepository->findOneBy(['username' => $username])) {
            return $this->json(['errors' => 'Username already exists'], 400);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
               $user,
               $password
                )
            );

        try {
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json([
                'user'=> [
                    'username'=> $data['username'],
                ],
            ]);
        }catch(Exception $e){
            return $this->json(['errors' => 'Could not register user'], 400);
        }
      
    }

    /**
     * Route: /api/auth (POST)
     *
     * Handles user authentication based on the provided JSON data.
     *
     * @param Request $request - HTTP Request object
     * @param UserPasswordHasherInterface $userPasswordHasher - Symfony's UserPasswordHasherInterface service
     * @param UserRepository $userRepository - Repository for user entities
     * @return JsonResponse
     */
    #[Route(path: 'api/auth', name: 'app_auth')]
    public function login(Request $request, UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'];
        $plainPassword = $data['password'];

        $user = $userRepository->findOneBy(['username' => $username]);

        if (!$user){
            return new JsonResponse(['error' => 'No such user'], Response::HTTP_NOT_FOUND);
        }

         if (!$userPasswordHasher->isPasswordValid($user, $plainPassword)) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse(['message' => 'User logged in successfully', 'username' => $username]);
    }

}
