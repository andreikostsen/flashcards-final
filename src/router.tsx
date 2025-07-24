import {
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

import { LoginPage } from '@/pages/auth/login/loginPage'
import { SignUpPage } from '@/pages/auth/signUp/signUpPage'
import { Cards } from '@/pages/cards'
import { Decks } from '@/pages/decks'
import { LearnDeckPage } from '@/pages/learnDeckPage'
import { Premium } from '@/pages/premium'
import { Profile } from '@/pages/profile/profile'
import { useAuthMeQuery } from '@/services/auth/auth.service'
import { ZodForm } from "@/pages/zodform";

const publicRoutes: RouteObject[] = [
  {
    element: <LoginPage />,
    errorElement: <div>This is login error!</div>,
    path: '/login',
  },
  {
    element: <SignUpPage />,
    errorElement: <div>This is sign-up error!</div>,
    path: '/signup',
  },
]

const privateRoutes: RouteObject[] = [
  {
    element: <Decks />,
    path: '/',
  },
  {
    element: <Profile />,
    path: '/profile',
  },
  {
    element: <Cards />,
    path: '/cards/:deckId',
  },
  {
    element: <LearnDeckPage />,
    path: 'cards/learn/:deckId',
  },
  {
    element: <LearnDeckPage />,
    path: 'cards/learn/:deckId/:previousCardId',
  },
  {
    element: <ZodForm />,
    path: '/zod',
  },
]

const premiumRoutes: RouteObject[] = [
  {
    //element: <div>premium content</div>,
    element: <Premium />,
    path: '/premium',
  },
]

const router = createBrowserRouter([
  {
    children: privateRoutes,
    element: <PrivateRoutes />,
    errorElement: <div>This is privateRoutes error!</div>,
  },
  {
    children: premiumRoutes,
    element: <PremiumRoutes />,
    errorElement: <div>This is premium error!</div>,
  },
  ...publicRoutes,
])

export const Router = () => {
  return <RouterProvider router={router} />
}

function PrivateRoutes() {
  const { isError, isLoading } = useAuthMeQuery()

  if (isLoading) {
    return null
  }

  const isAuthenticated = !isError

  console.log('isAuthenticated: ' + isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
}

function PremiumRoutes() {
  const isPremium = true

  return isPremium ? <Outlet /> : <div>Sorry, this is for Premium Users</div>
}
