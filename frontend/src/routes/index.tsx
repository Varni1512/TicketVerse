import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Home } from '../pages/Home';

// Placeholder components for routes
const Events = () => <div className="p-20 text-center">Events Page</div>;
const EventDetails = () => <div className="p-20 text-center">Event Details Page</div>;
const Login = () => <div className="p-20 text-center">Login Page</div>;
const Register = () => <div className="p-20 text-center">Register Page</div>;
const NotFound = () => <div className="p-20 text-center">404 Not Found</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'events',
        element: <Events />
      },
      {
        path: 'events/:id',
        element: <EventDetails />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
