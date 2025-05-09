<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * SecurityController Class
 *
 * Controller class responsible for handling security-related actions,
 * including login, logout, and obtaining CSRF tokens.
 * 
 * The controller is not used for the current state of the application.
 * All from React is done in Registration controller.
 *
 * @extends AbstractController
 * @package App\Controller
 */
class SecurityController extends AbstractController
{
    /**
     * Route: /api/login
     *
     * Handles user login using Symfony's AuthenticationUtils.
     *
     * @param AuthenticationUtils $authenticationUtils - Symfony's AuthenticationUtils service
     * @return JsonResponse
     */
    #[Route(path: '/api/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): JsonResponse
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        if ($error) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse(['message' => 'User logged in successfully', 'username' => $lastUsername]);
    }


    /**
     * Route: /api/logout
     *
     * Handles user logout.
     *
     * @throws \LogicException - This method can be blank and will be intercepted by the logout key on your firewall.
     */
    #[Route(path: 'api/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

     /**
     * Route: /api/csrf-token
     *
     * Retrieves and returns a CSRF token.
     *
     * @param CsrfTokenManagerInterface $tokenManager - Symfony's CsrfTokenManagerInterface service
     * @return JsonResponse
     */
    #[Route('/api/csrf-token', name: 'get_csrf_token')]
    public function getCsrfToken(CsrfTokenManagerInterface $tokenManager): JsonResponse
    {
        $token = $tokenManager->getToken('authenticate')->getValue();

        return $this->json(['token' => $token]);
    }

}
