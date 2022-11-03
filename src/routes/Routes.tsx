import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../components/ErrorPage'
import { queryClient } from '../react-query/queryClient'
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from './contact'
import EditContact, { action as editAction } from './edit'
import { action as destroyAction } from './destroy'
import Root, { loader as rootLoader, action as rootAction } from './root'
import Index from './index'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader(queryClient),
    errorElement: <ErrorPage />,
    action: rootAction(queryClient),
    children: [
      {
        errorElement: <ErrorPage />,
        action: rootAction(queryClient),
        loader: rootLoader(queryClient),
        children: [
          { index: true, element: <Index /> },

          {
            path: 'contacts/:contactId',
            loader: contactLoader(queryClient),
            element: <Contact />,
            action: contactAction(queryClient),
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader(queryClient),
            action: editAction(queryClient),
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      },
    ],
  },
])

export default function Routes() {
  return <RouterProvider router={router} />
}
