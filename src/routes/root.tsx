import React from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigation,
  Form,
  NavLink,
} from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { useGetContacts } from '../react-query/queries/useGetContacts'
import { contactQuery } from '../react-query/queries/useGetContact'
import { queryKeys } from '../react-query/contstants'

export default function Root() {
  const { q, queryClient } = useLoaderData() as {
    q: string
    queryClient: QueryClient
  }
  const { data: contacts } = useGetContacts(q)
  const navigation = useNavigation()

  return (
    <>
      <div id="sidebar">
        <Form method="post">
          <button className="btn btn-success w-full mt-8" type="submit">
            New
          </button>
        </Form>
        <nav>
          {contacts?.length ? (
            <ul className="menu bg-base-100 p-2 rounded-box">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* prefetch route data - will want to abstract to a custom component */}
                  <NavLink
                    onMouseEnter={() =>
                      queryClient.getQueryData([
                        queryKeys.contacts,
                        contact.id,
                      ]) ?? queryClient.fetchQuery(contactQuery(contact.id))
                    }
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  )
}
