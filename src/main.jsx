import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const EventPage = React.lazy(() => import('./pages/EventPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const AddEventPage = React.lazy(() => import('./pages/AddEventPage'));
const EditEventPage = React.lazy(() => import('./pages/EditEventPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));


import Root from './components/Root';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <EventsPage /> },
      { path: '/event/:eventId', element: <EventPage /> },
      { path: '/edit-event/:eventId', element: <EditEventPage /> },
      { path: '/add-event', element: <AddEventPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      {/* Suspense met Spinner als fallback voor dynamisch geladen pagina's */}
      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner size="xl" color="teal.500" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ChakraProvider>
  </React.StrictMode>
);
