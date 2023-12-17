import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Login from './components/Login.tsx';
import Root from './root/Root.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home.tsx';
import Police from './components/pages/Police.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },

      {
        path: '/police',
        element: <Police />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
