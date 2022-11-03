import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../components/ErrorPage'
import { queryClient } from '../react-query/queryClient'
// import { loader as contactLoader, action as contactAction } from './contact'
import * as Contact from './contact.route'
// import EditContact, { action as editAction } from './edit'
import * as Edit from './edit.route'
import { action as destroyAction } from './destroy'
// import Root, { loader as rootLoader, action as rootAction } from './root'
import * as Root from './root.route'
import Index from './index'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<p>loading...</p>}>
        <Root.Component />
      </React.Suspense>
    ),
    loader: Root.loader(queryClient),
    errorElement: <ErrorPage />,
    action: Root.action(queryClient),
    children: [
      {
        errorElement: <ErrorPage />,
        action: Root.action(queryClient),
        loader: Root.loader(queryClient),
        children: [
          { index: true, element: <Index /> },

          {
            path: 'contacts/:contactId',
            loader: Contact.loader(queryClient),
            element: (
              <React.Suspense fallback={<p>loading...</p>}>
                <Contact.Component />
              </React.Suspense>
            ),
            action: Contact.action(queryClient),
          },
          {
            path: 'contacts/:contactId/edit',
            element: (
              <React.Suspense fallback={<p>loading...</p>}>
                <Edit.Component />
              </React.Suspense>
            ),
            loader: Contact.loader(queryClient),
            action: Edit.action(queryClient),
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
