import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Landing } from '../pages/Landing';
import { Events } from '../pages/Events';
import { EventDetails } from '../pages/EventDetails';
import { SeatSelection } from '../pages/SeatSelection';
import { Checkout } from '../pages/Checkout';
import { BookingSuccess } from '../pages/BookingSuccess';
import { MyBookings } from '../pages/MyBookings';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Categories } from '../pages/Categories';
import { Album } from '../pages/Album';
import { AlbumDetails } from '../pages/AlbumDetails';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Oops! The page you are looking for does not exist.</p>
    <a href="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Go Home</a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'events', element: <Events /> },
      { path: 'categories', element: <Categories /> },
      { path: 'about', element: <About /> },
      { path: 'album', element: <Album /> },
      { path: 'album/:id', element: <AlbumDetails /> },
      { path: 'contact', element: <Contact /> },
      { path: 'events/:id', element: <EventDetails /> },
      { path: 'events/:id/seats', element: <SeatSelection /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'success', element: <BookingSuccess /> },
      { path: 'my-bookings', element: <MyBookings /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  }
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
